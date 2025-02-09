import "./AIMessage.css"

function formatAIMessage(message) {
    return message
      .replace(/\*\*\*(.*?)\*\*\*/g, "<h3>$1</h3>") // Convert ***text*** to h3 (sections)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **text** to bold
      .replace(/\n/g, "<br>") // Preserve line breaks
      .replace(/\* (.*?)(?=\n|\*)/g, "<li>$1</li>") // Ensure * list items are inline
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" class="ai-link">$1</a>'
      ) // Convert URLs to clickable links
      .replace(
        /Request an image of a (.*?)\. in (.*?) formatVIMLAPI-\d+/g,
        (_, image, format) =>
          `<br><img src="https://source.unsplash.com/300x200/?${image}" alt="${image}" style="width: 100%; max-width: 300px; display: block; margin-top: 10px; border-radius: 10px;">`
      ); // Dynamically insert images
  }
  
function AIMessage({ message }) {
  return (
    <div className="ai-box">
      <div
        className="ai-message"
        dangerouslySetInnerHTML={{ __html: formatAIMessage(message) }}
      ></div>
    </div>
  );
}

export default AIMessage;
