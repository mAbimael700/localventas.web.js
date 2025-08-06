import { useState, useRef } from 'react';

export const MarkdownEditor = () => {
  const [markdownText, setMarkdownText] = useState('');
  const textareaRef = useRef(null);

  const handleBoldButtonClick = () => {
    // Obtiene la posición actual del cursor en el textarea
    const cursorPosition = textareaRef.current.selectionStart;

    // Obtiene el texto antes y después del cursor
    const textBeforeCursor = markdownText.substring(0, cursorPosition);
    const textAfterCursor = markdownText.substring(cursorPosition);

    // Concatena el texto con formato Markdown para negrita
    const newText = textBeforeCursor + '**Texto en Negrita**' + textAfterCursor;

    // Actualiza el estado con el nuevo texto
    setMarkdownText(newText);

    // Establece la nueva posición del cursor después del texto en negrita
    const newCursorPosition = cursorPosition + '**Texto en Negrita**'.length;
    textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
  };

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={markdownText}
        onChange={(e) => setMarkdownText(e.target.value)}
        placeholder="Ingresa tu texto en formato Markdown..."
        rows={5}
        cols={50}
      />
      <div>
        <button onClick={handleBoldButtonClick}>Negrita</button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
