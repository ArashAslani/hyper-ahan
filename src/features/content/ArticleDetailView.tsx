"use client";

import { useState } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { Textarea } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import type { Article, ArticleComment } from "@/types";

type ArticleDetailViewProps = {
  article: Article;
};

export function ArticleDetailView({ article }: ArticleDetailViewProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<ArticleComment[]>(article.comments);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: ArticleComment = {
      id: comments.length + 1,
      user: "کاربر مهمان",
      text: newComment,
      date: new Date().toLocaleDateString("fa-IR"),
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href={routes.articles.list}
        className="mb-6 inline-block text-blue-600"
      >
        ← بازگشت به لیست مقالات
      </Link>
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image}
          alt={article.title}
          className="h-64 w-full object-cover md:h-96"
        />
        <div className="p-6 md:p-8">
          <h1 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
            {article.title}
          </h1>
          <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
            <span>✍️ {article.author}</span>
            <span>📅 {article.date}</span>
          </div>
          <div className="prose max-w-none leading-relaxed whitespace-pre-line text-gray-700">
            {article.content}
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="mb-6 text-xl font-bold">
              نظرات کاربران ({comments.length})
            </h2>
            <form onSubmit={handleAddComment} className="mb-8">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="نظر خود را بنویسید..."
              />
              <Button type="submit" className="mt-2">
                ارسال نظر
              </Button>
            </form>
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500">
                  هنوز نظری ثبت نشده است. اولین نفر باشید!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex justify-between text-sm text-gray-600">
                      <span className="font-semibold">{comment.user}</span>
                      <span>{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
