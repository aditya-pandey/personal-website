export function Footer() {
  return (
    <footer className="w-full mt-auto py-12 border-t border-stone/30">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-ink/70">
        <p className="font-sans">
          &copy; {new Date().getFullYear()} Aditya Pandey. A digital sanctuary.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0 font-sans">
          <a href="https://github.com/aditya-pandey" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-300">GitHub</a>
          <a href="https://www.linkedin.com/in/adityapandey99/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-300">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
