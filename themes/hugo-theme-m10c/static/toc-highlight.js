document.addEventListener("DOMContentLoaded", () => {
  // Select all headings and TOC links
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const tocLinks = document.querySelectorAll(".post-toc a");

  // Set up an IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          // Highlight the active TOC link
          tocLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "0px 0px -80% 0px", threshold: 0.2 }
  );

  // Observe each heading
  headings.forEach((heading) => observer.observe(heading));
});
