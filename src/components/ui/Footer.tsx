export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-12 md:py-16 mt-auto border-t border-stone/30 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-sm font-sans text-ink/60 transition-colors duration-500">
      <div className="flex flex-col gap-1 text-center md:text-left">
        <span className="font-serif text-lg text-ink transition-colors duration-500">Aditya Pandey</span>
        <span className="tracking-wide">Somewhere between systems and stories.</span>
      </div>
      <div className="flex flex-col md:items-end gap-1 text-center md:text-right tracking-wide">
        <span>Made slowly. Updated occasionally.</span>
        <span>&copy; {currentYear}</span>
      </div>
    </footer>
  );
}
