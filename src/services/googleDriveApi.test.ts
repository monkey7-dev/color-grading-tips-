import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  ensurePresetFolder,
  listDriveFiles,
  uploadToDrive,
  downloadDriveFile,
  deleteDriveFile,
  getDriveStorageInfo,
} from './googleDriveApi';

describe('Google Drive API Client Tests', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('ensurePresetFolder finds existing folder if present', async () => {
    globalThis.fetch = async (url: any) => {
      if (String(url).includes('files?q=')) {
        return {
          ok: true,
          json: async () => ({ files: [{ id: 'folder-xyz123', name: 'Color Matrix Presets' }] }),
        } as any;
      }
      throw new Error('Unexpected URL');
    };

    const folderId = await ensurePresetFolder('mock-token');
    assert.strictEqual(folderId, 'folder-xyz123');
  });

  test('ensurePresetFolder creates folder if not found', async () => {
    globalThis.fetch = async (url: any, opts: any) => {
      if (String(url).includes('files?q=')) {
        return {
          ok: true,
          json: async () => ({ files: [] }),
        } as any;
      }
      if (opts?.method === 'POST') {
        const body = JSON.parse(opts.body);
        assert.strictEqual(body.name, 'Color Matrix Presets');
        return {
          ok: true,
          json: async () => ({ id: 'new-folder-789' }),
        } as any;
      }
      throw new Error('Unexpected fetch call');
    };

    const folderId = await ensurePresetFolder('mock-token');
    assert.strictEqual(folderId, 'new-folder-789');
  });

  test('listDriveFiles queries Drive and returns file items', async () => {
    globalThis.fetch = async (url: any) => {
      assert.match(String(url), /drive\/v3\/files/);
      return {
        ok: true,
        json: async () => ({
          files: [
            { id: 'f1', name: 'warm_harmony_3dlut.cube', mimeType: 'text/plain', size: '2048' },
            { id: 'f2', name: 'blade_runner_preset.xmp', mimeType: 'application/rdf+xml', size: '1024' },
          ],
        }),
      } as any;
    };

    const files = await listDriveFiles({ accessToken: 'mock-token', folderId: 'folder-1' });
    assert.strictEqual(files.length, 2);
    assert.strictEqual(files[0].name, 'warm_harmony_3dlut.cube');
    assert.strictEqual(files[1].name, 'blade_runner_preset.xmp');
  });

  test('uploadToDrive sends multipart payload and returns file metadata', async () => {
    let capturedBody: any;
    globalThis.fetch = async (url: any, opts: any) => {
      assert.match(String(url), /upload\/drive\/v3\/files/);
      assert.strictEqual(opts.method, 'POST');
      assert.strictEqual(opts.headers.Authorization, 'Bearer test-token');
      capturedBody = opts.body;
      return {
        ok: true,
        json: async () => ({
          id: 'uploaded-lut-1',
          name: 'cinema_grade.cube',
          mimeType: 'text/plain',
          size: '512',
        }),
      } as any;
    };

    const res = await uploadToDrive({
      name: 'cinema_grade.cube',
      content: 'LUT_3D_SIZE 17\n0 0 0',
      mimeType: 'text/plain',
      folderId: 'folder-1',
      accessToken: 'test-token',
    });

    assert.strictEqual(res.id, 'uploaded-lut-1');
    assert.strictEqual(res.name, 'cinema_grade.cube');
    assert.ok(capturedBody instanceof Blob);
  });

  test('deleteDriveFile issues DELETE method to drive endpoint', async () => {
    let methodCalled = '';
    globalThis.fetch = async (url: any, opts: any) => {
      assert.match(String(url), /files\/del-target-123/);
      methodCalled = opts.method;
      return { ok: true, status: 204 } as any;
    };

    const success = await deleteDriveFile('del-target-123', 'mock-token');
    assert.strictEqual(success, true);
    assert.strictEqual(methodCalled, 'DELETE');
  });

  test('getDriveStorageInfo retrieves user and storage usage', async () => {
    globalThis.fetch = async (url: any) => {
      assert.match(String(url), /drive\/v3\/about/);
      return {
        ok: true,
        json: async () => ({
          storageQuota: { limit: '16106127360', usage: '52428800' },
          user: { displayName: 'Colorist User', emailAddress: 'user@example.com' },
        }),
      } as any;
    };

    const info = await getDriveStorageInfo('mock-token');
    assert.strictEqual(info.user?.emailAddress, 'user@example.com');
    assert.strictEqual(info.usage, '52428800');
  });
});
