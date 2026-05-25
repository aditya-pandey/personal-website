import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface BaseMetadata {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  cover?: string;
  link?: string;
}

export interface LibraryMetadata extends BaseMetadata {
  author: string;
  reflection?: string;
  quote?: string;
}

export interface MDXDocument<T = BaseMetadata> {
  slug: string;
  metadata: T;
  content: string;
}

export interface CurrentReading {
  title: string;
  author: string;
  cover?: string;
  note: string;
}

function getMDXFiles(dir: string): string[] {
  const targetDir = path.join(contentDirectory, dir);
  if (!fs.existsSync(targetDir)) return [];
  return fs.readdirSync(targetDir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile<T = BaseMetadata>(filePath: string): MDXDocument<T> {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  const slug = path.basename(filePath, path.extname(filePath));

  return {
    slug,
    metadata: data as T,
    content,
  };
}

function getMDXData<T extends BaseMetadata = BaseMetadata>(dir: string): MDXDocument<T>[] {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles
    .map((file) => readMDXFile<T>(path.join(contentDirectory, dir, file)))
    .sort((a, b) => {
      if (new Date(a.metadata.date || "") > new Date(b.metadata.date || "")) return -1;
      return 1;
    });
}

export function getThoughts() {
  return getMDXData("thoughts");
}

export function getPoetry() {
  return getMDXData("poetry");
}

export function getExperiments() {
  return getMDXData("experiments");
}

export function getLibrary() {
  return getMDXData<LibraryMetadata>("library");
}

export function getThoughtBySlug(slug: string) {
  const thoughts = getThoughts();
  return thoughts.find((t) => t.slug === slug);
}

export function getPoetryBySlug(slug: string) {
  const poetry = getPoetry();
  return poetry.find((p) => p.slug === slug);
}

export function getExperimentBySlug(slug: string) {
  const experiments = getExperiments();
  return experiments.find((e) => e.slug === slug);
}

export function getLibraryBySlug(slug: string) {
  const library = getLibrary();
  return library.find((l) => l.slug === slug);
}

export function getCurrentReading(): CurrentReading | null {
  const filePath = path.join(contentDirectory, "library", "current-reading.json");
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as CurrentReading;
}
