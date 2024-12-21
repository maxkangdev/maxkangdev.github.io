document.addEventListener('DOMContentLoaded', function() {
  const languageSwitcher = document.getElementById('language-switcher');

  if (languageSwitcher) {
  // Function to save the scroll position before page switch
  function saveScrollPosition() {
  localStorage.setItem('scrollPos', window.scrollY);
}

  // Function to restore the scroll position as early as possible
  function restoreScrollPosition() {
  const scrollPos = localStorage.getItem('scrollPos');
  if (scrollPos) {
  window.scrollTo(0, scrollPos);
  localStorage.removeItem('scrollPos');  // Clean up after restoring
}
}

  // Attach event listener to the translate button
  languageSwitcher.addEventListener('click', function(event) {
  event.preventDefault();  // Prevent the default navigation
  saveScrollPosition();  // Save the scroll position

  // Navigate to the new page after saving scroll position
  window.location.href = languageSwitcher.href;
});

  // Restore scroll position at the earliest possible moment
  restoreScrollPosition();
} else {
  console.error("Language switcher element not found.");
}
});
