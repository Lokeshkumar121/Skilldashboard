// src/services/caseStudyService.js

import api from "./api";

export const getCaseStudies = () =>
  api.get("/case-studies");

export const getPublishedCaseStudies = () =>
  api.get("/case-studies/published");

export const getCaseStudyBySlug = (slug) =>
  api.get(`/case-studies/slug/${slug}`);
export const updateCaseStudy = (id, data) =>
  api.patch(`/case-studies/${id}`, data);
export const deleteCaseStudy = (id) =>
  api.delete(`/case-studies/${id}`);