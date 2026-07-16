import React, { useMemo, useState } from "react";
import { FiExternalLink, FiUser, FiImage, FiEdit2, FiTrash2 } from "react-icons/fi";

import admissionFormImg from "../assets/projects/admission-form.png";
import calculatorImg from "../assets/projects/calculator.png";
import resumeImg from "../assets/projects/resume.png";
import counterAppImg from "../assets/projects/counter-app.png";
import todoAppImg from "../assets/projects/todo-app.png";
import coffeeShopImg from "../assets/projects/coffee-shop.png";

// Deterministic gradient fallback (used only if no image is available,
// or the image fails to load) — keeps the old letter-tile look as a safety net.
const THUMB_COLORS = [
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-blue-500",
  "from-orange-400 to-rose-500",
  "from-purple-400 to-fuchsia-500",
  "from-cyan-400 to-sky-500",
];

function colorFor(id) {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return THUMB_COLORS[Math.abs(hash) % THUMB_COLORS.length];
}

// Keyword -> real project screenshot, matched against the project title.
// Falls through to a generic placeholder if nothing matches.
const IMAGE_RULES = [
  { keywords: ["admission", "registration", "student"], url: admissionFormImg },
  { keywords: ["calculator", "calculater"], url: calculatorImg },
  { keywords: ["resume", "cv"], url: resumeImg },
  { keywords: ["counter"], url: counterAppImg },
  { keywords: ["to-do", "todo", "task"], url: todoAppImg },
  { keywords: ["coffee"], url: coffeeShopImg },
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=340&fit=crop";

function resolveImage(project) {
  // 1. Use a real image URL from the database if the project has one.
  if (project.image) return project.image;

  // 2. Otherwise, match the title against known project types.
  const title = (project.title || "").toLowerCase();
  const rule = IMAGE_RULES.find((r) => r.keywords.some((kw) => title.includes(kw)));
  if (rule) return rule.url;

  // 3. Generic professional placeholder for anything unrecognized.
  return DEFAULT_IMAGE;
}

export default function ProjectCard({ project, currentUserId, onEdit, onDelete }) {
  const gradient = colorFor(project._id);
  const imageSrc = useMemo(() => resolveImage(project), [project]);
  const [imageFailed, setImageFailed] = useState(false);

  const ownerId =
    typeof project.owner === "object" ? project.owner?._id : project.owner;
  const isOwner = currentUserId && ownerId && String(ownerId) === String(currentUserId);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="relative">
        {!imageFailed ? (
          <img
            src={imageSrc}
            alt={project.title}
            onError={() => setImageFailed(true)}
            className="h-[150px] w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className={`flex h-[150px] w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
            <FiImage className="h-8 w-8 text-white/80" />
          </div>
        )}

        {isOwner && (
          <div className="absolute right-2 top-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(project)}
              aria-label="Edit project"
              title="Edit project"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white hover:text-[#1E5AA8] dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-blue-400"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project)}
              aria-label="Delete project"
              title="Delete project"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white hover:text-red-600 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-red-400"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <FiUser className="h-3 w-3" /> {project.developer}
        </p>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          {project.description}
        </p>

        <a
          href={project.hostedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          View Hosted Project
          <FiExternalLink className="h-3.5 w-3.5 text-gray-400" />
        </a>

        <div className="mt-3 border-t border-gray-100 pt-3 text-[11px] text-gray-400 dark:border-gray-700">
          Submitted {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
