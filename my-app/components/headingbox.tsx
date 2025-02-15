import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold, Italic, Underline, Strikethrough, Settings2,
  X, AlignLeft, AlignCenter, AlignRight, AlignJustify, Trash2, GripVertical
} from "lucide-react";

interface HeadingBoxProps {
  id: number;
  x: number;
  y: number;
  text: string;
  isDragging: boolean;
  fontFamily: string;
  onUpdate: (id: number, newText: string) => void;
  onPositionChange: (id: number, x: number, y: number) => void;
  onDelete: (id: number) => void;
  onStyleChange: (id: number, styles: Record<string, boolean>) => void;
  styles?: Record<string, boolean>;
}

export default function HeadingBox({
  id,
  x,
  y,
  text,
  fontFamily,
  onUpdate,
  onPositionChange,
  onDelete,
  onStyleChange,
  styles = {},
}: HeadingBoxProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [localText, setLocalText] = useState(text);
  const headingRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const caretPositionRef = useRef<number | null>(null);

  const [currentStyles, setCurrentStyles] = useState<Record<string, boolean>>({
    bold: styles.bold || false,
    italic: styles.italic || false,
    underline: styles.underline || false,
    strikethrough: styles.strikethrough || false,
    alignLeft: styles.alignLeft || true,
    alignCenter: styles.alignCenter || false,
    alignRight: styles.alignRight || false,
    alignJustify: styles.alignJustify || false,
  });

  // Update local text when prop changes
  useEffect(() => {
    setLocalText(text);
  }, [text]);

  // Save caret position
  const saveCaretPosition = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      caretPositionRef.current = range.startOffset;
    }
  }, []);

  // Restore caret position
  const restoreCaretPosition = useCallback(() => {
    if (caretPositionRef.current === null || !editableRef.current) return;

    const selection = window.getSelection();
    const range = document.createRange();
    const textNode = editableRef.current.firstChild || editableRef.current;

    try {
      range.setStart(textNode, Math.min(caretPositionRef.current, textNode.textContent?.length || 0));
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    } catch (e) {
      console.error("Error restoring caret position:", e);
    }
  }, []);

  // Handle text input with debounce
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || "";
    saveCaretPosition();
    setLocalText(newText);
    onUpdate(id, newText);
  }, [id, onUpdate, saveCaretPosition]);

  // Click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      headingRef.current &&
      !headingRef.current.contains(event.target as Node) &&
      toolbarRef.current &&
      !toolbarRef.current.contains(event.target as Node)
    ) {
      setIsSelected(false);
      setShowToolbar(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Enhanced drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragHandleRef.current?.contains(e.target as Node)) return;

    const rect = headingRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    setIsSelected(true);

    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !headingRef.current) return;

    const canvas = headingRef.current.parentElement;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    // Constrain movement within canvas boundaries
    const maxX = canvasRect.width - (headingRef.current?.offsetWidth || 0);
    const maxY = canvasRect.height - (headingRef.current?.offsetHeight || 0);

    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));

    onPositionChange(id, constrainedX, constrainedY);
  }, [isDragging, dragOffset, id, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleStyle = (styleName: keyof typeof currentStyles) => {
    const newStyles = { ...currentStyles };

    if (styleName.startsWith("align")) {
      Object.keys(newStyles).forEach((key) => {
        if (key.startsWith("align")) {
          newStyles[key as keyof typeof currentStyles] = key === styleName;
        }
      });
    } else {
      newStyles[styleName] = !newStyles[styleName];
    }

    setCurrentStyles(newStyles);
    onStyleChange(id, newStyles);
  };

  const getAlignment = () => {
    if (currentStyles.alignCenter) return "center";
    if (currentStyles.alignRight) return "right";
    if (currentStyles.alignJustify) return "justify";
    return "left";
  };

  // Restore caret position after render
  useEffect(() => {
    if (isSelected && editableRef.current) {
      restoreCaretPosition();
    }
  }, [isSelected, localText, restoreCaretPosition]);

  return (
    <div
      ref={headingRef}
      className={`absolute ${isSelected ? "z-20" : "z-10"} ${isDragging ? "cursor-grabbing" : ""}`}
      style={{
        top: `${y}px`,
        left: `${x}px`,
        width: "auto",
        minWidth: "150px",
        maxWidth: "400px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(true);
      }}
    >
      {/* Drag Handle */}
      <div
        ref={dragHandleRef}
        className={`absolute -left-8 top-1/2 transform -translate-y-1/2 p-1.5 cursor-grab 
          ${isSelected ? "visible" : "invisible"} 
          ${isDragging ? "cursor-grabbing" : ""}`}
        onMouseDown={handleMouseDown}
      >
        <GripVertical size={16} className="text-gray-400" />
      </div>

      {/* Content Container */}
      <div
        className={`relative bg-transparent rounded-lg transition-all duration-200
          ${isSelected ? "ring-2 ring-teal-400" : "ring-1 ring-gray-600 ring-opacity-50"}`}
      >
        {/* Editable Content */}
        <div
          className="min-h-[40px] p-3 outline-none"
          style={{
            fontFamily,
            fontWeight: currentStyles.bold ? "bold" : "normal",
            fontStyle: currentStyles.italic ? "italic" : "normal",
            textDecoration: `${currentStyles.underline ? "underline" : ""} ${
              currentStyles.strikethrough ? "line-through" : ""
            }`.trim(),
            textAlign: getAlignment(),
          }}
        >
          <div
            ref={editableRef}
            className="outline-none text-white break-words whitespace-pre-wrap"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={saveCaretPosition}
            onKeyUp={saveCaretPosition}
            onClick={saveCaretPosition}
          >
            {localText}
          </div>
        </div>

        {/* Settings Button */}
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowToolbar(!showToolbar);
            }}
            className="absolute -right-8 top-1/2 transform -translate-y-1/2 bg-gray-800 
              text-white p-1.5 rounded-full shadow-lg border border-gray-600 
              hover:bg-gray-700 transition-colors z-30"
          >
            <Settings2 size={16} />
          </button>
        )}
      </div>

      {/* Floating Toolbar */}
      {showToolbar && (
        <div 
          ref={toolbarRef} 
          className="absolute left-0 top-full mt-2 z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600 p-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white text-sm font-medium">Format Heading</h3>
              <button 
                onClick={() => setShowToolbar(false)} 
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Text Formatting */}
              <div className="flex gap-1">
                <button
                  onClick={() => toggleStyle("bold")}
                  className={`p-1.5 rounded hover:bg-gray-700 ${currentStyles.bold ? "bg-teal-600" : ""}`}
                >
                  <Bold size={16} />
                </button>
                <button
                  onClick={() => toggleStyle("italic")}
                  className={`p-1.5 rounded hover:bg-gray-700 ${currentStyles.italic ? "bg-teal-600" : ""}`}
                >
                  <Italic size={16} />
                </button>
                <button
                  onClick={() => toggleStyle("underline")}
                  className={`p-1.5 rounded hover:bg-gray-700 ${currentStyles.underline ? "bg-teal-600" : ""}`}
                >
                  <Underline size={16} />
                </button>
                <button
                  onClick={() => toggleStyle("strikethrough")}
                  className={`p-1.5 rounded hover:bg-gray-700 ${currentStyles.strikethrough ? "bg-teal-600" : ""}`}
                >
                  <Strikethrough size={16} />
                </button>
              </div>

              {/* Text Alignment */}
              <div className="flex gap-1">
                <button
                  onClick={() => toggleStyle("alignLeft")}
                  className={`p-1.5 rounded hover:bg-gray-700 ${currentStyles.alignLeft ? "bg-teal-600" : ""}`}
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  onClick={() => toggleStyle("alignCenter")}
                  className={`p-1.5 rounded hover:bg-gray-700 ${currentStyles.alignCenter ? "bg-teal-600" : ""}`}
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  onClick={() => toggleStyle("alignRight")}
                  className={`p-1.5 rounded hover:bg-gray-700 ${currentStyles.alignRight ? "bg-teal-600" : ""}`}
                >
                  <AlignRight size={16} />
                </button>
                <button
                  onClick={() => toggleStyle("alignJustify")}
                  className={`p-1.5 rounded hover:bg-gray-700 ${currentStyles.alignJustify ? "bg-teal-600" : ""}`}
                >
                  <AlignJustify size={16} />
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => {
                  onDelete(id);
                  setShowToolbar(false);
                }}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 
                  p-1.5 rounded hover:bg-gray-700 w-full text-sm"
              >
                <Trash2 size={16} />
                <span>Delete Heading</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}