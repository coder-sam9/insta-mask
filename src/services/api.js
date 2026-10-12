const OL_BASE = "https://openlibrary.org";

function getIaIds(record) {
  if (Array.isArray(record.ia)) return record.ia.filter(Boolean);
  return typeof record.ia === "string" && record.ia ? [record.ia] : [];
}

async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Open Library request failed (${response.status}).`);
  }
  return response.json();
}

export const api = {
  async getShelfBooks(slug, limit = 24, signal) {
    const url = `${OL_BASE}/subjects/${slug}.json?limit=${limit}&details=true`;
    const data = await getJson(url, signal);
    return (data.works || []).map(this.normalizeWork);
  },

  async getTrending(limit = 24, signal) {
    const url = `${OL_BASE}/trending/daily.json`;
    const data = await getJson(url, signal);
    return (data.works || []).slice(0, limit).map(this.normalizeTrending);
  },

  async search(query, limit = 30, signal) {
    const url = `${OL_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i,ia,subject`;
    const data = await getJson(url, signal);
    return {
      count: data.numFound || 0,
      results: (data.docs || []).map(this.normalizeSearch),
    };
  },

  async getWorkDetails(workId) {
    const url = `${OL_BASE}/works/${workId}.json`;
    const data = await getJson(url);

    let desc = data.description;
    if (desc && typeof desc === "object") desc = desc.value;

    return {
      title: data.title,
      description: desc || null,
      subjects: data.subjects || [],
      ocaid: data.ocaid || null,
    };
  },

  normalizeWork(w) {
    const ia = getIaIds(w);
    return {
      id: w.key.replace("/works/", ""),
      title: w.title || "Untitled",
      authors: w.authors?.map((a) => a.name).filter(Boolean) || [],
      year: w.first_publish_year || null,
      coverId: w.cover_id || null,
      hasScan: ia.length > 0,
      iaId: ia[0] || null,
      subjects: (w.subject || []).slice(0, 6),
    };
  },

  normalizeTrending(w) {
    const ia = getIaIds(w);
    const author =
      typeof w.author === "string" ? w.author : w.author?.name;
    return {
      id: w.key.replace("/works/", ""),
      title: w.title || "Untitled",
      authors: [author].filter(Boolean),
      year: null,
      coverId: w.covers?.[0] || w.cover_id || null,
      hasScan: ia.length > 0,
      iaId: ia[0] || null,
      subjects: (w.subject || []).slice(0, 6),
    };
  },

  normalizeSearch(doc) {
    const ia = getIaIds(doc);
    return {
      id: doc.key.replace("/works/", ""),
      title: doc.title || "Untitled",
      authors: doc.author_name || [],
      year: doc.first_publish_year || null,
      coverId: doc.cover_i || null,
      hasScan: ia.length > 0,
      iaId: ia[0] || null,
      subjects: (doc.subject || []).slice(0, 6),
    };
  },

  getCoverUrl(coverId, size = "M") {
    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
      : null;
  },
};
