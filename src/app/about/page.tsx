import Image from "next/image";
import { TextReveal, ParallaxImage, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

export const metadata = {
  title: "About | Aditya Pandey",
  description: "Learn more about the author of this digital sanctuary.",
};

export default function About() {
  return (
    <div className="w-full max-w-[800px] mx-auto px-5 lg:px-8 py-16 md:py-[120px]">
      <header className="mb-12 md:mb-[80px] border-b border-stone/50 pb-8 text-center md:text-left">
        <TextReveal 
          text="About" 
          className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6"
        />
      </header>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <ParallaxImage className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-lg overflow-hidden border border-stone/50 p-1 mx-auto md:mx-0">
          <div className="w-full h-full relative rounded-lg overflow-hidden bg-surface">
            <Image
              src="/portrait.png"
              alt="Aditya Pandey"
              fill
              className="object-cover grayscale contrast-125"
            />
          </div>
        </ParallaxImage>

        <StaggerContainer className="prose-none font-sans text-lg text-ink/90 leading-[1.7] space-y-6">
          <StaggerItem>
            <p>
              I am a writer and systems thinker with a deep love for technology, philosophy, poetry, books, movies, and music.
            </p>
          </StaggerItem>
          <StaggerItem>
            <p>
              My journey began with commerce at K.C. College in Mumbai, evolved through an MBA at IIM Kashipur, and led me to the dynamic world of Customer Experience (CX) and Marketing Technology (MarTech).
            </p>
          </StaggerItem>
          <StaggerItem>
            <p>
              This website is my digital sanctuary—a quiet corner of the internet where I archive my thoughts, poetry, and experiments away from the noise of traditional social media.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
}
