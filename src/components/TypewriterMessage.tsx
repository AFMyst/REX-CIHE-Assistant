import React, { useState, useEffect, useRef } from 'react';

interface TypewriterMessageProps {
  contentHtml: string;
  isStreaming: boolean;
  onStreamingComplete?: () => void;
  onScrollToBottom?: () => void;
}

/**
 * Truncates an HTML string up to `charLimit` text characters while keeping
 * all tags well-formed, preserving styles, and appending a streaming cursor.
 */
function getTruncatedHtml(
  html: string,
  charLimit: number,
  showCursor: boolean = false
): { html: string; totalChars: number; isComplete: boolean } {
  if (!html) return { html: '', totalChars: 0, isComplete: true };

  const container = document.createElement('div');
  container.innerHTML = html;

  function getTextLength(node: Node): number {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue?.length || 0;
    }
    let sum = 0;
    for (let i = 0; i < node.childNodes.length; i++) {
      sum += getTextLength(node.childNodes[i]);
    }
    return sum;
  }

  const totalChars = getTextLength(container);
  if (charLimit >= totalChars) {
    return { html, totalChars, isComplete: true };
  }

  let remaining = Math.max(0, charLimit);
  let cursorInserted = false;

  function cloneNodeWithLimit(node: Node): Node | null {
    if (remaining <= 0 && cursorInserted) {
      return null;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue || '';
      if (text.length <= remaining) {
        remaining -= text.length;
        return document.createTextNode(text);
      } else {
        const sliced = text.slice(0, remaining);
        remaining = 0;
        const frag = document.createDocumentFragment();
        if (sliced) {
          frag.appendChild(document.createTextNode(sliced));
        }
        if (showCursor && !cursorInserted) {
          cursorInserted = true;
          const cursor = document.createElement('span');
          cursor.className = 'inline-block w-2 h-4 ml-0.5 bg-[#002147] animate-pulse align-middle rounded-xs';
          cursor.setAttribute('aria-hidden', 'true');
          frag.appendChild(cursor);
        }
        return frag;
      }
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const clone = document.createElement(el.tagName.toLowerCase());

      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        clone.setAttribute(attr.name, attr.value);
      }

      let hasChildren = false;
      for (let i = 0; i < el.childNodes.length; i++) {
        const childClone = cloneNodeWithLimit(el.childNodes[i]);
        if (childClone) {
          clone.appendChild(childClone);
          hasChildren = true;
        }
      }

      const isSelfClosing = ['BR', 'HR', 'IMG'].includes(el.tagName);
      if (hasChildren || isSelfClosing) {
        return clone;
      }
      return null;
    }

    return null;
  }

  const outputDiv = document.createElement('div');
  for (let i = 0; i < container.childNodes.length; i++) {
    const child = cloneNodeWithLimit(container.childNodes[i]);
    if (child) {
      outputDiv.appendChild(child);
    }
  }

  if (showCursor && !cursorInserted) {
    const cursor = document.createElement('span');
    cursor.className = 'inline-block w-2 h-4 ml-0.5 bg-[#002147] animate-pulse align-middle rounded-xs';
    cursor.setAttribute('aria-hidden', 'true');
    outputDiv.appendChild(cursor);
  }

  return {
    html: outputDiv.innerHTML,
    totalChars,
    isComplete: false
  };
}

export const TypewriterMessage: React.FC<TypewriterMessageProps> = ({
  contentHtml,
  isStreaming,
  onStreamingComplete,
  onScrollToBottom
}) => {
  const [displayedHtml, setDisplayedHtml] = useState<string>(() => {
    // If not streaming, display full content immediately
    return isStreaming ? '' : contentHtml;
  });

  const onStreamingCompleteRef = useRef(onStreamingComplete);
  const onScrollToBottomRef = useRef(onScrollToBottom);
  onStreamingCompleteRef.current = onStreamingComplete;
  onScrollToBottomRef.current = onScrollToBottom;

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedHtml(contentHtml);
      return;
    }

    // Measure total text characters
    const temp = document.createElement('div');
    temp.innerHTML = contentHtml;

    function getTextLength(node: Node): number {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue?.length || 0;
      let sum = 0;
      for (let i = 0; i < node.childNodes.length; i++) {
        sum += getTextLength(node.childNodes[i]);
      }
      return sum;
    }

    const totalChars = getTextLength(temp);

    if (totalChars <= 0) {
      setDisplayedHtml(contentHtml);
      onStreamingCompleteRef.current?.();
      return;
    }

    // Target animation duration: smooth & energetic (between 700ms and 2400ms max)
    const targetDurationMs = Math.min(2400, Math.max(700, totalChars * 3.2));
    const tickIntervalMs = 22; // ~45 fps
    const totalTicks = targetDurationMs / tickIntervalMs;
    const charsPerTick = Math.max(1, Math.ceil(totalChars / totalTicks));

    let currentChars = 0;
    let scrollThrottle = 0;

    const interval = setInterval(() => {
      currentChars += charsPerTick;
      scrollThrottle++;

      if (currentChars >= totalChars) {
        clearInterval(interval);
        setDisplayedHtml(contentHtml);
        onStreamingCompleteRef.current?.();
        onScrollToBottomRef.current?.();
      } else {
        const res = getTruncatedHtml(contentHtml, currentChars, true);
        setDisplayedHtml(res.html);

        // Auto-scroll every 3 ticks (~66ms) to keep reading flow smooth
        if (scrollThrottle % 3 === 0) {
          onScrollToBottomRef.current?.();
        }
      }
    }, tickIntervalMs);

    return () => clearInterval(interval);
  }, [contentHtml, isStreaming]);

  return (
    <div
      className="text-sm md:text-base text-[#0b1c30] leading-relaxed space-y-3 prose max-w-none transition-opacity duration-200"
      dangerouslySetInnerHTML={{ __html: displayedHtml }}
    />
  );
};
