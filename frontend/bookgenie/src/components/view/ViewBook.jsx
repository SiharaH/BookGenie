import { useState } from "react"
import { ChevronLeft, Menu } from "lucide-react"
import ViewChapterSidebar from "./ViewChapterSidebar"

const ViewBook = ({book}) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  const selectedChapter = book.chapters[selectedChapterIndex];

  const formatContent = (content) => {
    return content
      .split("\n\n")
      .filter(paragraph => paragraph.trim())
      .map(paragraph => paragraph.trim())
      .map(paragraph => {
        paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        paragraph = paragraph.replace(/(?<!\*)\*(?!\*)/g, "<em>$1</em>");
        return `<p>${paragraph}</p>`;
      })
      .join("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white text-gray-900">
      <ViewChapterSidebar
        book={book}
        selectedChapterIndex={selectedChapterIndex}
        onSelectChapter= {setSelectedChapterIndex}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-base md:text-lg truncate">{book.title}</h1>
              <p className="text-sm text-gray-500">by {book.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size controls */}
            <div className="flex items-center gap-2 mr-4">
              <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-bold">
                A-
              </button>
              <span className="text-sm text-gray-500">{fontSize}px</span>
              <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-lg font-bold">
                A+
              </button>
            </div>
          </div>
        </header>

        {/* Reading area */}
        <div className="flex-1 overflow-y-auto">
          <div className=" max-w-4xl mx-auto px-6 py-12">
            {/* Chapter title */}
            <h1 className="text-xl md:text-3xl font-bold mb-8 leading-tight">{selectedChapter.title}</h1>

            {/* Chapter content */}
            <div 
              className="reading-content"
              style={{ fontSize: `${fontSize}px`,
              lineHeight: 1.8, 
              fontFamily: 'Charter, Georgia, "Times New Roman", serif' }}
              dangerouslySetInnerHTML={{ __html: formatContent(selectedChapter.content) }}/>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200">
                <button 
                  onClick={() => setSelectedChapterIndex(Math.max(0, selectedChapterIndex - 1))}
                  disabled={selectedChapterIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Chapter
                </button>

                <span className="text-sm text-gray-500">{selectedChapterIndex + 1} of {book.chapters.length}</span>

                <button 
                  onClick={() => setSelectedChapterIndex(Math.min(book.chapters.length - 1, selectedChapterIndex + 1))}
                  disabled={selectedChapterIndex === book.chapters.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Chapter
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .reading-content p {
          margin-bottom: 1.5em;
          text-align: justify;
          hyphens: auto;
        }
       .reading-content p:first-child {
          margin-top: 0;
        }
        .reading-content p:last-child {
          margin-bottom: 0;
        }
       .reading-content strong {
          font-weight: 600;
          color: #1f2937;
        }
        .reading-content em {
          font-style: italic;
        }
       `}
      </style>
    </div>
  )
}

export default ViewBook
