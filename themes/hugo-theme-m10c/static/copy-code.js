document.addEventListener('DOMContentLoaded', function() {
  // Select all code blocks
  const codeBlocks = document.querySelectorAll('pre > code');

  // Loop over each code block and add a copy icon
  codeBlocks.forEach((codeBlock) => {
    // Create the icon element
    const copyIcon = document.createElement('span');
    copyIcon.className = 'copy-icon';
    copyIcon.innerHTML = '<i class="fas fa-copy"></i>'; // FontAwesome copy icon
    copyIcon.title = 'Copy';
    copyIcon.style.cursor = 'pointer';
    copyIcon.style.float = 'right';
    copyIcon.style.marginTop = '5px';
    copyIcon.style.padding = '0 5px';

    // Insert the icon at the top-right corner of the code block
    codeBlock.parentNode.insertBefore(copyIcon, codeBlock);

    // Initialize ClipboardJS for this icon
    const clipboard = new ClipboardJS(copyIcon, {
      target: function() {
        return codeBlock;
      }
    });

    // Handle success/failure
    clipboard.on('success', function() {
      copyIcon.innerHTML = '<i class="fas fa-check"></i>'; // Change icon to "check"
      copyIcon.title = 'Copied!';
      setTimeout(() => {
        copyIcon.innerHTML = '<i class="fas fa-copy"></i>'; // Revert back to copy icon
        copyIcon.title = 'Copy';
      }, 2000);
    });

    clipboard.on('error', function() {
      copyIcon.innerHTML = '<i class="fas fa-times"></i>'; // Change to "error" icon
      copyIcon.title = 'Failed';
      setTimeout(() => {
        copyIcon.innerHTML = '<i class="fas fa-copy"></i>'; // Revert to copy icon
        copyIcon.title = 'Copy';
      }, 2000);
    });
  });
});
