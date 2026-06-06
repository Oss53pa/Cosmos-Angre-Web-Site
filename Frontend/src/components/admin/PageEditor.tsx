import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Eye, EyeOff, Monitor, Smartphone, Tablet } from 'lucide-react';

interface PageEditorProps {
  initialContent?: string;
  initialTitle?: string;
  onSave?: (content: string, title: string) => void;
  page?: string;
}

const PageEditor: React.FC<PageEditorProps> = ({
  initialContent = '',
  initialTitle = '',
  onSave,
  page: _page = 'Page',
}) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    setContent(initialContent);
    setTitle(initialTitle);
  }, [initialContent, initialTitle]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'image',
    'video',
  ];

  const handleSave = () => {
    if (onSave) {
      onSave(content, title);
    }
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      case 'desktop':
        return 'max-w-full';
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la page..."
              className="text-2xl font-light border-none focus:outline-none bg-transparent w-full"
            />
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-cosmos-blue text-white font-light hover:bg-opacity-90 transition-colors"
          >
            <Save className="w-4 h-4" strokeWidth={1.5} />
            Enregistrer
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-900 transition-colors font-light"
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Eye className="w-4 h-4" strokeWidth={1.5} />
            )}
            {showPreview ? 'Masquer' : 'Afficher'} Prévisualisation
          </button>

          {showPreview && (
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 ${previewMode === 'desktop' ? 'bg-gray-200' : 'hover:bg-gray-100'} transition-colors`}
                title="Desktop"
              >
                <Monitor className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 ${previewMode === 'tablet' ? 'bg-gray-200' : 'hover:bg-gray-100'} transition-colors`}
                title="Tablette"
              >
                <Tablet className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 ${previewMode === 'mobile' ? 'bg-gray-200' : 'hover:bg-gray-100'} transition-colors`}
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor and Preview */}
      <div className={`flex-1 overflow-hidden ${showPreview ? 'grid grid-cols-2' : ''}`}>
        {/* Editor */}
        <div className="h-full overflow-y-auto border-r border-gray-200">
          <div className="p-6">
            <h3 className="text-sm text-gray-500 font-light uppercase tracking-wider mb-4">
              Éditeur
            </h3>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Commencez à écrire votre contenu..."
              className="bg-white"
              style={{ height: 'calc(100vh - 300px)' }}
            />
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="h-full overflow-y-auto bg-gray-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-500 font-light uppercase tracking-wider">
                  Prévisualisation {previewMode === 'mobile' && '(Mobile)'}
                  {previewMode === 'tablet' && '(Tablette)'}
                  {previewMode === 'desktop' && '(Desktop)'}
                </h3>
                <span className="text-xs text-gray-400 font-light">Mise à jour en direct</span>
              </div>

              <div className={`mx-auto transition-all duration-300 ${getPreviewWidth()}`}>
                <div className="bg-white border border-gray-200 shadow-sm p-8 min-h-screen">
                  {title && (
                    <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">
                      {title}
                    </h1>
                  )}

                  <div
                    className="prose prose-lg max-w-none
                      prose-headings:font-light prose-headings:tracking-tight
                      prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl
                      prose-p:font-light prose-p:text-gray-600
                      prose-a:text-cosmos-blue prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 prose-strong:font-medium
                      prose-ul:font-light prose-ol:font-light
                      prose-blockquote:font-light prose-blockquote:border-l-gold
                      prose-code:font-mono prose-code:text-sm
                      prose-img:border prose-img:border-gray-200"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageEditor;
