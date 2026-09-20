// src/services/blogService.js

import api from "./api";

export const getBlogs = () =>
  api.get("/blogs");

export const getPublishedBlogs = () =>
  api.get("/blogs/published");

export const getBlogBySlug = (slug) =>
  api.get(`/blogs/slug/${slug}`);

export const deleteBlog = (id) =>
  api.delete(`/blogs/${id}`);