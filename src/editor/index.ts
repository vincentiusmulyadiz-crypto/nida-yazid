export const EDITOR_BUNDLE_MARKER = "EDITOR_BUNDLE_MARKER_7f3a";

// Reference the marker so it is guaranteed retained in the editor chunk
if (typeof window !== 'undefined') {
  (window as any).__ebm = EDITOR_BUNDLE_MARKER;
}
