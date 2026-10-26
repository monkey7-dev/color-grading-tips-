import React, { useState, useEffect } from 'react';
import {
  googleSignIn,
  googleSignOut,
  initAuth,
  getAccessToken,
} from '../services/googleDriveAuth';
import {
  ensurePresetFolder,
  uploadToDrive,
  listDriveFiles,
  downloadDriveFile,
  deleteDriveFile,
  getDriveStorageInfo,
  DriveFileItem,
  DriveStorageQuota,
} from '../services/googleDriveApi';
import { ColorRecipe, generateAseBuffer, generateCubeLut, generateLightroomXmp } from '../utils/exporters';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Folder,
  FileCode,
  Image,
  FileText,
  X,
  ExternalLink,
  HardDrive,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import type { User } from 'firebase/auth';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: ColorRecipe[];
  onLoadRecipeIntoApp?: (recipe: ColorRecipe) => void;
  onLoadImageIntoAnalyzer?: (imageUrl: string, filename: string) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  recipes,
  onLoadRecipeIntoApp,
  onLoadImageIntoAnalyzer,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [folderId, setFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [quota, setQuota] = useState<DriveStorageQuota | null>(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [fileFilter, setFileFilter] = useState<'all' | 'presets' | 'images'>('all');

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Confirmation dialog state for destructive actions (MANDATORY per Workspace Skill)
  const [pendingDeleteFile, setPendingDeleteFile] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        loadDriveData(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setFiles([]);
        setQuota(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const loadDriveData = async (accessToken: string) => {
    setIsLoadingFiles(true);
    try {
      const fId = await ensurePresetFolder(accessToken);
      setFolderId(fId);

      const [fileList, storageQuota] = await Promise.all([
        listDriveFiles({ accessToken, folderId: fId }),
        getDriveStorageInfo(accessToken).catch(() => null),
      ]);

      setFiles(fileList);
      if (storageQuota) setQuota(storageQuota);
    } catch (err: any) {
      console.error('Error loading Drive contents:', err);
      setStatusMessage({ text: `Could not load Drive files: ${err.message}`, isError: true });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setStatusMessage({ text: 'Connected to Google Drive successfully.' });
        await loadDriveData(res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      setFiles([]);
      setQuota(null);
      setStatusMessage({ text: 'Signed out from Google Drive.' });
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleSyncAllRecipes = async () => {
    if (!token || !folderId || recipes.length === 0) return;
    setIsUploading(true);
    setStatusMessage({ text: `Uploading ${recipes.length} recipes to Google Drive...` });

    try {
      let uploadCount = 0;
      for (const recipe of recipes) {
        // Upload JSON package
        const jsonContent = JSON.stringify(recipe, null, 2);
        const fileName = `${recipe.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_palette.json`;
        await uploadToDrive({
          name: fileName,
          content: jsonContent,
          mimeType: 'application/json',
          folderId,
          accessToken: token,
        });

        // Upload .CUBE 3D LUT
        const cubeLut = generateCubeLut(recipe);
        const cubeName = `${recipe.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_3dlut.cube`;
        await uploadToDrive({
          name: cubeName,
          content: cubeLut,
          mimeType: 'text/plain',
          folderId,
          accessToken: token,
        });

        uploadCount += 2;
      }

      setStatusMessage({ text: `Successfully synced ${uploadCount} files to your Google Drive!` });
      await loadDriveData(token);
    } catch (err: any) {
      setStatusMessage({ text: `Sync error: ${err.message}`, isError: true });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadSingleRecipe = async (recipe: ColorRecipe, format: 'json' | 'cube' | 'ase' | 'xmp') => {
    if (!token || !folderId) return;
    setIsUploading(true);
    try {
      const cleanName = recipe.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      let name = '';
      let content: string | Uint8Array;
      let mimeType = 'text/plain';

      if (format === 'json') {
        name = `${cleanName}_palette.json`;
        content = JSON.stringify(recipe, null, 2);
        mimeType = 'application/json';
      } else if (format === 'cube') {
        name = `${cleanName}_3dlut.cube`;
        content = generateCubeLut(recipe);
        mimeType = 'text/plain';
      } else if (format === 'xmp') {
        name = `${cleanName}_preset.xmp`;
        content = generateLightroomXmp(recipe);
        mimeType = 'application/rdf+xml';
      } else {
        name = `${cleanName}.ase`;
        content = generateAseBuffer(recipe.name, recipe.swatches);
        mimeType = 'application/octet-stream';
      }

      await uploadToDrive({
        name,
        content,
        mimeType,
        folderId,
        accessToken: token,
      });

      setStatusMessage({ text: `Uploaded ${name} to Google Drive.` });
      await loadDriveData(token);
    } catch (err: any) {
      setStatusMessage({ text: `Upload failed: ${err.message}`, isError: true });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadFile = async (file: DriveFileItem) => {
    if (!token) return;
    try {
      setStatusMessage({ text: `Downloading ${file.name}...` });
      const { text, blob, name } = await downloadDriveFile(file.id, token);

      if (text && name.endsWith('.json') && onLoadRecipeIntoApp) {
        try {
          const parsed = JSON.parse(text);
          if (parsed.swatches && Array.isArray(parsed.swatches)) {
            onLoadRecipeIntoApp(parsed);
            setStatusMessage({ text: `Loaded recipe '${parsed.name}' into Color Harmonies!` });
            return;
          }
        } catch {
          // not a recipe JSON
        }
      }

      // If image and analyzer hook present
      if (file.mimeType.startsWith('image/') && onLoadImageIntoAnalyzer) {
        const objectUrl = URL.createObjectURL(blob);
        onLoadImageIntoAnalyzer(objectUrl, file.name);
        setStatusMessage({ text: `Loaded image '${file.name}' into Skin Tone Analyzer!` });
        return;
      }

      // Standard browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({ text: `Downloaded ${name} successfully.` });
    } catch (err: any) {
      setStatusMessage({ text: `Download failed: ${err.message}`, isError: true });
    }
  };

  // Explicit confirmation before deletion (MANDATORY per Workspace guidelines)
  const confirmDeleteFile = async () => {
    if (!pendingDeleteFile || !token) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(pendingDeleteFile.id, token);
      setStatusMessage({ text: `Permanently deleted '${pendingDeleteFile.name}' from Google Drive.` });
      setPendingDeleteFile(null);
      await loadDriveData(token);
    } catch (err: any) {
      setStatusMessage({ text: `Deletion failed: ${err.message}`, isError: true });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (fileFilter === 'presets') {
      return (
        f.name.endsWith('.cube') ||
        f.name.endsWith('.ase') ||
        f.name.endsWith('.xmp') ||
        f.name.endsWith('.json')
      );
    }
    if (fileFilter === 'images') {
      return f.mimeType.startsWith('image/');
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-cyan-500/20 rounded-xl border border-slate-700">
              <Cloud className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Google Drive Cloud Sync</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded">
                  v3 REST API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Backup, organize, and sync your LUTs, color palettes, and film presets with Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Google Drive modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Alert Bar */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center justify-between border-b ${
              statusMessage.isError
                ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
                : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs hover:underline opacity-80 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Auth Bar */}
        <div className="px-6 py-3.5 bg-slate-950/40 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {user ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-8 h-8 rounded-full border border-cyan-500/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    {user.email ? user.email[0].toUpperCase() : 'G'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>{user.displayName || user.email}</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{user.email}</span>
                    {quota && quota.usage && quota.limit && (
                      <span className="text-slate-500">
                        · {(Number(quota.usage) / (1024 * 1024)).toFixed(1)} MB used
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => token && loadDriveData(token)}
                  disabled={isLoadingFiles}
                  className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg flex items-center gap-1.5 transition-colors"
                  title="Refresh Drive files"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin text-cyan-400' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-2.5 py-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Connect your Google account with permission to store and load color presets in your personal Google Drive.
                </span>
              </div>

              {/* Official Google Sign-In Button */}
              <button
                onClick={handleSignIn}
                disabled={isLoadingAuth}
                className="shrink-0 flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg shadow transition-all duration-150 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoadingAuth ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            </div>
          )}
        </div>

        {authError && (
          <div className="px-6 py-2 bg-rose-950/80 text-rose-300 text-xs border-b border-rose-900">
            {authError}
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cloud Backup &amp; Sync</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Save all {recipes.length} local harmony recipes and 3D LUTs directly into your{' '}
                  <span className="text-cyan-300 font-mono">"Color Matrix Presets"</span> Drive folder.
                </p>
              </div>

              <button
                onClick={handleSyncAllRecipes}
                disabled={!user || isUploading || recipes.length === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-500 rounded-lg flex items-center justify-center gap-2 transition-colors shrink-0 shadow"
              >
                <Cloud className={`w-3.5 h-3.5 ${isUploading ? 'animate-pulse' : ''}`} />
                <span>{isUploading ? 'Syncing to Drive...' : 'Sync All to Drive'}</span>
              </button>
            </div>
          </div>

          {/* Drive Files Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Files in "Color Matrix Presets"
                </h4>
                <span className="text-xs text-slate-500 font-mono">({filteredFiles.length})</span>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Filter files..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-3 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 w-full sm:w-48"
                />
                <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5 shrink-0">
                  <button
                    onClick={() => setFileFilter('all')}
                    className={`px-2 py-0.5 text-[11px] rounded ${
                      fileFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFileFilter('presets')}
                    className={`px-2 py-0.5 text-[11px] rounded ${
                      fileFilter === 'presets' ? 'bg-slate-800 text-white' : 'text-slate-400'
                    }`}
                  >
                    Presets
                  </button>
                  <button
                    onClick={() => setFileFilter('images')}
                    className={`px-2 py-0.5 text-[11px] rounded ${
                      fileFilter === 'images' ? 'bg-slate-800 text-white' : 'text-slate-400'
                    }`}
                  >
                    Images
                  </button>
                </div>
              </div>
            </div>

            {/* File List */}
            {!user ? (
              <div className="p-10 border border-dashed border-slate-800 rounded-xl text-center space-y-3 bg-slate-950/20">
                <HardDrive className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Sign in with Google to view and manage your cloud presets, 3D LUTs, and color grading files.
                </p>
                <button
                  onClick={handleSignIn}
                  disabled={isLoadingAuth}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                >
                  Sign in with Google
                </button>
              </div>
            ) : isLoadingFiles ? (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
                <div>Reading Google Drive files...</div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="p-10 border border-dashed border-slate-800 rounded-xl text-center space-y-2 bg-slate-950/20">
                <Folder className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">No files in your cloud preset folder yet</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Click "Sync All to Drive" above or export individual recipes as .ASE, .CUBE, or .XMP to save them to your Google Drive.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredFiles.map(file => {
                  const isLut = file.name.endsWith('.cube');
                  const isAse = file.name.endsWith('.ase');
                  const isXmp = file.name.endsWith('.xmp');
                  const isJson = file.name.endsWith('.json');
                  const isImg = file.mimeType.startsWith('image/');

                  return (
                    <div
                      key={file.id}
                      className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                          {isLut && <FileCode className="w-4 h-4 text-cyan-400" />}
                          {isAse && <FileCode className="w-4 h-4 text-indigo-400" />}
                          {isXmp && <FileCode className="w-4 h-4 text-amber-400" />}
                          {isJson && <FileText className="w-4 h-4 text-emerald-400" />}
                          {isImg && <Image className="w-4 h-4 text-rose-400" />}
                          {!isLut && !isAse && !isXmp && !isJson && !isImg && (
                            <FileText className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate" title={file.name}>
                            {file.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {file.size ? `${(Number(file.size) / 1024).toFixed(1)} KB` : 'Google File'}
                            {file.modifiedTime && (
                              <span> · {new Date(file.modifiedTime).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="p-1.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs"
                          title="Download or Load into app"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs"
                            title="Open in Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => setPendingDeleteFile(file)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg text-xs"
                          title="Delete from Google Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>OAuth 2.0 Client-side Bearer Token Authentication Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

        {/* Explicit User Confirmation Modal for Destructive Deletion (MANDATORY per Workspace Skill) */}
        {pendingDeleteFile && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-rose-900/60 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="text-base font-bold text-white">Confirm Permanent Deletion</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                  {pendingDeleteFile.name}
                </span>{' '}
                from your Google Drive? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setPendingDeleteFile(null)}
                  disabled={isDeleting}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteFile}
                  disabled={isDeleting}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-lg flex items-center gap-1.5 shadow"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Permanently Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
