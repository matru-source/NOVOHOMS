"use client";

import { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import type { ManagedOpportunity } from "@/lib/opportunity-store";
import type { Enquiry } from "@/lib/enquiry-store";
import type { ActivityLog } from "@/lib/history-store";
import { BrandMark } from "@/components/SiteShell";

type Notice = { type: "success" | "error"; text: string } | null;
type Draft = Omit<ManagedOpportunity, "id" | "updatedAt"> & { id?: number; updatedAt?: string };

const emptyDraft = (): Draft => ({
  slug: "",
  name: "",
  eyebrow: "Residential · Bhubaneswar",
  location: "",
  tagline: "",
  summary: "",
  config: "",
  status: "Under construction",
  category: "Residential",
  image: "",
  gallery: [],
  highlights: [],
  published: true,
  featured: false,
  sortOrder: 0,
});

const parseLines = (value: string, first: "label" | "title", second: "image" | "text") =>
  value
    .split("\n")
    .map((line) => {
      const [head, ...rest] = line.split("|");
      return { [first]: head?.trim() || "", [second]: rest.join("|").trim() };
    })
    .filter((item) => item[first] && item[second]);

export default function AdminPanel() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  // Tab navigation: "opportunities" | "enquiries" | "history"
  const [activeTab, setActiveTab] = useState<"opportunities" | "enquiries" | "history">("opportunities");

  // History state
  const [historyLogs, setHistoryLogs] = useState<ActivityLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"ALL" | "opportunity" | "enquiry">("ALL");
  const [historySearch, setHistorySearch] = useState("");
  const [undoingId, setUndoingId] = useState<number | null>(null);

  // Opportunities state
  const [items, setItems] = useState<ManagedOpportunity[]>([]);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [galleryItems, setGalleryItems] = useState<{ label: string; image: string }[]>([]);
  const [galleryText, setGalleryText] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualUrlMode, setManualUrlMode] = useState(false);
  const [dragOverPrimary, setDragOverPrimary] = useState(false);
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquiryQuery, setEnquiryQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const loadOpportunities = async () => {
    try {
      const response = await fetch("/api/admin/opportunities", { cache: "no-store" });
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = (await response.json()) as { error?: string; opportunities?: ManagedOpportunity[] };
      if (!response.ok) throw new Error(data.error || "Unable to load opportunities.");
      setItems(data.opportunities || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEnquiries = async () => {
    try {
      const response = await fetch("/api/admin/enquiries", { cache: "no-store" });
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = (await response.json()) as { error?: string; enquiries?: Enquiry[] };
      if (response.ok) {
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch("/api/admin/history", { cache: "no-store" });
      if (response.ok) {
        const data = (await response.json()) as { history?: ActivityLog[] };
        setHistoryLogs(data.history || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleUndo = async (log: ActivityLog) => {
    if (!window.confirm(`Undo this action?\n\n"${log.description}"\n\nThis will restore previous data.`)) {
      return;
    }
    setUndoingId(log.id);
    try {
      const res = await fetch(`/api/admin/history/${log.id}/undo`, {
        method: "POST",
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || "Failed to undo action.");
      setNotice({ type: "success", text: data.message || "Action reverted successfully." });
      await loadAll();
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Failed to undo action." });
    } finally {
      setUndoingId(null);
    }
  };

  const loadAll = async () => {
    await Promise.all([loadOpportunities(), loadEnquiries(), loadHistory()]);
  };

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) {
          setAuthenticated(true);
          await loadAll();
        }
      })
      .catch(() => undefined)
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedEnquiry) setSelectedEnquiry(null);
        else if (draft) setDraft(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEnquiry, draft]);

  // Filtered Opportunities
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        `${item.name} ${item.location} ${item.category} ${item.status}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [items, query]
  );
  const publishedCount = items.filter((item) => item.published).length;
  const featuredCount = items.filter((item) => item.featured).length;

  // Filtered Enquiries
  const filteredEnquiries = useMemo(
    () =>
      enquiries.filter((e) => {
        const matchesQuery =
          `${e.name} ${e.phone} ${e.email} ${e.category} ${e.message} ${e.sourcePage}`
            .toLowerCase()
            .includes(enquiryQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || e.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [enquiries, enquiryQuery, statusFilter]
  );
  const newEnquiriesCount = enquiries.filter((e) => e.status === "New").length;

  const filteredHistory = useMemo(() => {
    return historyLogs.filter((item) => {
      const matchesType =
        historyFilter === "ALL" || item.entityType === historyFilter;
      const matchesSearch =
        `${item.entityName} ${item.description} ${item.actorEmail} ${item.actionType}`
          .toLowerCase()
          .includes(historySearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [historyLogs, historyFilter, historySearch]);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const renderActionBadge = (type: ActivityLog["actionType"]) => {
    switch (type) {
      case "OPPORTUNITY_CREATE":
        return <span className="admin-hist-badge created">Project Created</span>;
      case "OPPORTUNITY_UPDATE":
        return <span className="admin-hist-badge updated">Project Updated</span>;
      case "OPPORTUNITY_DELETE":
        return <span className="admin-hist-badge deleted">Project Deleted</span>;
      case "ENQUIRY_STATUS_UPDATE":
        return <span className="admin-hist-badge status">Status Changed</span>;
      case "ENQUIRY_DELETE":
        return <span className="admin-hist-badge deleted">Enquiry Deleted</span>;
      case "UNDO":
        return <span className="admin-hist-badge undo">Reverted (Undo)</span>;
      default:
        return <span className="admin-hist-badge">{type}</span>;
    }
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to sign in.");
      setAuthenticated(true);
      setPassword("");
      await loadAll();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to sign in." });
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setItems([]);
    setEnquiries([]);
    setDraft(null);
    setNotice(null);
  };

  const openDraft = (item: ManagedOpportunity | Draft) => {
    setDraft({ ...item });
    const gList = item.gallery ? [...item.gallery] : [];
    setGalleryItems(gList);
    setGalleryText(gList.map((g) => `${g.label} | ${g.image}`).join("\n"));
    setHighlightsText(item.highlights ? item.highlights.map((h) => `${h.title} | ${h.text}`).join("\n") : "");
    setUploadError(null);
    setManualUrlMode(false);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as { error?: string; url?: string };
    if (!res.ok || !data.url) {
      throw new Error(data.error || "Failed to upload image.");
    }
    return data.url;
  };

  const handlePrimaryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !draft) return;
    setUploadingPrimary(true);
    setUploadError(null);
    try {
      const url = await uploadFile(file);
      setDraft((prev) => (prev ? { ...prev, image: url } : null));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingPrimary(false);
      e.target.value = "";
    }
  };

  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !draft) return;
    setUploadingGallery(true);
    setUploadError(null);
    try {
      const uploaded: { label: string; image: string }[] = [];
      for (const file of files) {
        const url = await uploadFile(file);
        const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
        const label = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "Gallery Image";
        uploaded.push({ label, image: url });
      }
      setGalleryItems((prev) => {
        const next = [...prev, ...uploaded];
        setGalleryText(next.map((g) => `${g.label} | ${g.image}`).join("\n"));
        return next;
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload gallery images.");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const updateGalleryLabel = (index: number, newLabel: string) => {
    setGalleryItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], label: newLabel };
      setGalleryText(next.map((g) => `${g.label} | ${g.image}`).join("\n"));
      return next;
    });
  };

  const removeGalleryItem = (index: number) => {
    setGalleryItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setGalleryText(next.map((g) => `${g.label} | ${g.image}`).join("\n"));
      return next;
    });
  };

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    setGalleryItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      setGalleryText(next.map((g) => `${g.label} | ${g.image}`).join("\n"));
      return next;
    });
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.image) {
      setNotice({ type: "error", text: "Please upload or provide a primary cover image." });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const parsedDraft = {
        ...draft,
        gallery: galleryItems.length > 0 ? galleryItems : (parseLines(galleryText, "label", "image") as ManagedOpportunity["gallery"]),
        highlights: parseLines(highlightsText, "title", "text") as ManagedOpportunity["highlights"],
      };
      const endpoint = draft.id ? `/api/admin/opportunities/${draft.id}` : "/api/admin/opportunities";
      const response = await fetch(endpoint, {
        method: draft.id ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsedDraft),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to save opportunity.");
      await loadOpportunities();
      setDraft(null);
      setNotice({
        type: "success",
        text: draft.id ? "Opportunity updated." : "Opportunity created.",
      });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to save opportunity." });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: ManagedOpportunity) => {
    if (!window.confirm(`Delete “${item.name}”? This cannot be undone.`)) return;
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/opportunities/${item.id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to delete opportunity.");
      await loadOpportunities();
      setNotice({ type: "success", text: "Opportunity deleted." });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to delete opportunity." });
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: Enquiry["status"]) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
    } catch (err) {
      alert("Unable to update status. Please try again.");
    }
  };

  const handleDeleteEnquiry = async (id: number, clientName: string) => {
    if (!window.confirm(`Delete enquiry from “${clientName}”? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete enquiry.");
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) setSelectedEnquiry(null);
      setNotice({ type: "success", text: "Enquiry deleted." });
    } catch (err) {
      setNotice({ type: "error", text: "Unable to delete enquiry." });
    }
  };

  if (checking)
    return (
      <main className="admin-shell admin-loading">
        <div className="admin-loader-mark" style={{ border: "none", background: "none", width: "auto", height: "auto" }}>
          <BrandMark size={44} />
        </div>
        <p>Opening workspace…</p>
      </main>
    );

  if (!authenticated)
    return (
      <main className="admin-login">
        <section className="admin-login-brand">
          <a href="/" className="brand" style={{ color: "white" }}>
            <BrandMark size={34} />
            <span>NOVOHOMS</span>
          </a>
          <div>
            <p>Private workspace</p>
            <h1>
              Manage every
              <br />
              <em>opportunity.</em>
            </h1>
            <small>Projects and client leads managed here appear across the NOVOHOMS website.</small>
          </div>
          <span className="admin-login-index">ADMIN / 01</span>
        </section>
        <section className="admin-login-form">
          <form onSubmit={login}>
            <p className="admin-overline">Secure access</p>
            <h2>Welcome back.</h2>
            <p>Sign in with your NOVOHOMS administrator credentials.</p>
            {notice && <div className={`admin-notice ${notice.type}`}>{notice.text}</div>}
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
                placeholder="admin@example.com"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                placeholder="Enter your password"
              />
            </label>
            <button type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in to dashboard"}
              <span>→</span>
            </button>
            <a href="/">← Return to website</a>
          </form>
        </section>
      </main>
    );

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="brand" style={{ color: "white" }}>
          <BrandMark size={34} />
          <span>NOVOHOMS</span>
        </a>
        <nav>
          <button
            className={activeTab === "opportunities" ? "active" : ""}
            onClick={() => setActiveTab("opportunities")}
          >
            <i>01</i> Opportunities
          </button>
          <button
            className={activeTab === "enquiries" ? "active" : ""}
            onClick={() => setActiveTab("enquiries")}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <i>02</i> Enquiries & Leads
            </span>
            {newEnquiriesCount > 0 && (
              <span
                style={{
                  background: "var(--admin-gold)",
                  color: "white",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 12,
                }}
              >
                {newEnquiriesCount} New
              </span>
            )}
          </button>
          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => {
              setActiveTab("history");
              setHistoryFilter("ALL");
              setHistorySearch("");
              loadHistory();
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <i>03</i> Action History
            </span>
          </button>
          <a href="/opportunities" target="_blank">
            <i>↗</i> View live site
          </a>
        </nav>
        <div className="admin-user">
          <span>JS</span>
          <div>
            <b>Jigyasha Singh</b>
            <small>Administrator</small>
          </div>
          <button onClick={logout} aria-label="Sign out">
            ↪
          </button>
        </div>
      </aside>

      {/* TAB 1: OPPORTUNITIES */}
      {activeTab === "opportunities" && (
        <section className="admin-workspace">
          <header className="admin-topbar">
            <div>
              <p>Content management</p>
              <h1>Opportunities</h1>
            </div>
            <button className="admin-primary" onClick={() => openDraft(emptyDraft())}>
              <span>＋</span> Add opportunity
            </button>
          </header>
          {notice && (
            <div className={`admin-notice ${notice.type}`}>
              {notice.text}
              <button onClick={() => setNotice(null)}>×</button>
            </div>
          )}
          <div className="admin-stats">
            <article>
              <span>Total projects</span>
              <b>{items.length.toString().padStart(2, "0")}</b>
              <small>All opportunity records</small>
            </article>
            <article>
              <span>Published</span>
              <b>{publishedCount.toString().padStart(2, "0")}</b>
              <small>Visible on the website</small>
            </article>
            <article>
              <span>Drafts</span>
              <b>{(items.length - publishedCount).toString().padStart(2, "0")}</b>
              <small>Hidden from visitors</small>
            </article>
            <article>
              <span>Featured</span>
              <b>{featuredCount.toString().padStart(2, "0")}</b>
              <small>Prioritized in listings</small>
            </article>
          </div>
          <div className="admin-list-card">
            <div className="admin-list-tools">
              <div>
                <h2>Project portfolio</h2>
                <p>Control what appears in Opportunities.</p>
              </div>
              <label className="admin-search">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search projects"
                />
              </label>
            </div>
            <div className="admin-table-head">
              <span>Project</span>
              <span>Status</span>
              <span>Visibility</span>
              <span>Order</span>
              <span>Actions</span>
            </div>
            <div className="admin-project-list">
              {filtered.map((item) => (
                <article key={item.id} className="admin-project-row">
                  <div className="admin-project-name">
                    <img src={item.image} alt="" />
                    <div>
                      <b>{item.name}</b>
                      <small>
                        {item.location} · {item.config}
                      </small>
                    </div>
                  </div>
                  <span className="admin-project-status">{item.status}</span>
                  <span className={`admin-visibility ${item.published ? "live" : "draft"}`}>
                    <i />
                    {item.published ? "Published" : "Draft"}
                  </span>
                  <span className="admin-order">{item.sortOrder.toString().padStart(2, "0")}</span>
                  <div className="admin-row-actions">
                    <button onClick={() => openDraft(item)}>Edit</button>
                    <a
                      href={`/properties/${item.slug}`}
                      target="_blank"
                      aria-label={`Preview ${item.name}`}
                      title="Preview page"
                    >
                      ↗
                    </a>
                    <button
                      className="danger"
                      onClick={() => remove(item)}
                      aria-label={`Delete ${item.name}`}
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {!filtered.length && (
              <div className="admin-empty">
                <b>No matching opportunities</b>
                <p>Try another search or add a new project.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 2: ENQUIRIES / LEADS */}
      {activeTab === "enquiries" && (
        <section className="admin-workspace">
          <header className="admin-topbar">
            <div>
              <p>Lead management</p>
              <h1>Client Enquiries</h1>
            </div>
            <button
              className="admin-primary"
              style={{ background: "#2e7d58" }}
              onClick={() => {
                loadEnquiries();
                setNotice({ type: "success", text: "Enquiries refreshed." });
              }}
            >
              <span>↻</span> Refresh Leads
            </button>
          </header>
          {notice && (
            <div className={`admin-notice ${notice.type}`}>
              {notice.text}
              <button onClick={() => setNotice(null)}>×</button>
            </div>
          )}
          <div className="admin-stats">
            <article>
              <span>Total leads</span>
              <b>{enquiries.length.toString().padStart(2, "0")}</b>
              <small>All website enquiries</small>
            </article>
            <article style={{ borderTopColor: "#b35f52" }}>
              <span>New uncontacted</span>
              <b style={{ color: "#b35f52" }}>{newEnquiriesCount.toString().padStart(2, "0")}</b>
              <small>Awaiting response</small>
            </article>
            <article style={{ borderTopColor: "#4e9365" }}>
              <span>Contacted</span>
              <b>{enquiries.filter((e) => e.status === "Contacted").length.toString().padStart(2, "0")}</b>
              <small>In conversation</small>
            </article>
            <article>
              <span>Closed</span>
              <b>{enquiries.filter((e) => e.status === "Closed").length.toString().padStart(2, "0")}</b>
              <small>Completed leads</small>
            </article>
          </div>

          <div className="admin-list-card">
            <div className="admin-list-tools">
              <div>
                <h2>Inbound Enquiries</h2>
                <p>Leads captured directly from website forms.</p>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["All", "New", "Contacted", "Follow-up", "Closed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      style={{
                        padding: "6px 12px",
                        fontSize: 11,
                        cursor: "pointer",
                        border: "1px solid rgba(18,53,46,.15)",
                        background: statusFilter === st ? "var(--admin-ink)" : "white",
                        color: statusFilter === st ? "white" : "var(--admin-ink)",
                        fontWeight: 600,
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <label className="admin-search">
                  <span>⌕</span>
                  <input
                    value={enquiryQuery}
                    onChange={(e) => setEnquiryQuery(e.target.value)}
                    placeholder="Search name, phone, msg…"
                  />
                </label>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "130px 1.4fr 1.2fr 2fr 130px 100px",
                gap: 16,
                padding: "12px 26px",
                background: "#ecebe5",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: ".14em",
                color: "#788681",
                fontWeight: 700,
              }}
            >
              <span>Date</span>
              <span>Client details</span>
              <span>Category / Page</span>
              <span>Message</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="admin-project-list">
              {filteredEnquiries.map((e) => {
                const dateStr = new Date(e.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const timeStr = new Date(e.createdAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const cleanPhone = e.phone.replace(/[^0-9]/g, "");
                const waText = encodeURIComponent(
                  `Hi ${e.name}, this is from NOVOHOMS Advisory regarding your enquiry for ${e.category}. How can we assist you?`
                );
                const waLink = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=${waText}`;

                return (
                  <article
                    key={e.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 1.4fr 1.2fr 2fr 130px 100px",
                      gap: 16,
                      alignItems: "center",
                      padding: "17px 26px",
                      borderBottom: "1px solid rgba(18,53,46,.085)",
                    }}
                  >
                    <div>
                      <b style={{ fontSize: 13, display: "block" }}>{dateStr}</b>
                      <small style={{ color: "#87928f", fontSize: 11 }}>{timeStr}</small>
                    </div>

                    <div>
                      <b style={{ fontSize: 15, fontFamily: "var(--serif)", display: "block" }}>
                        {e.name}
                      </b>
                      <small style={{ display: "block", color: "var(--ink)", fontWeight: 600 }}>
                        {e.phone}
                      </small>
                      {e.email && (
                        <small style={{ display: "block", color: "#667771" }}>{e.email}</small>
                      )}
                    </div>

                    <div>
                      <span
                        style={{
                          background: "#e8eff1",
                          color: "#1c4550",
                          padding: "3px 8px",
                          fontSize: 11,
                          fontWeight: 600,
                          borderRadius: 2,
                          display: "inline-block",
                        }}
                      >
                        {e.category}
                      </span>
                      {e.sourcePage && (
                        <small style={{ display: "block", color: "#87928f", marginTop: 4 }}>
                          {e.sourcePage}
                        </small>
                      )}
                    </div>

                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "#4a5a54",
                          maxHeight: 44,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedEnquiry(e)}
                        title="Click to view full message"
                      >
                        {e.message || <i style={{ color: "#aaa" }}>No additional note.</i>}
                      </p>
                    </div>

                    <div>
                      <select
                        value={e.status}
                        onChange={(event) =>
                          handleUpdateStatus(e.id, event.target.value as Enquiry["status"])
                        }
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 8px",
                          border: "1px solid rgba(18,53,46,.2)",
                          background:
                            e.status === "New"
                              ? "#fdf2f2"
                              : e.status === "Contacted"
                              ? "#eefbf3"
                              : "#fff",
                          color:
                            e.status === "New"
                              ? "#9b1c1c"
                              : e.status === "Contacted"
                              ? "#1b7340"
                              : "var(--admin-ink)",
                          borderRadius: 2,
                          cursor: "pointer",
                        }}
                      >
                        <option value="New">● New</option>
                        <option value="Contacted">● Contacted</option>
                        <option value="Follow-up">● Follow-up</option>
                        <option value="Closed">● Closed</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        title="Chat on WhatsApp"
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: "50%",
                          background: "#2e7d58",
                          color: "white",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        W
                      </a>
                      <a
                        href={`tel:${e.phone}`}
                        title="Call Client"
                        style={{
                          height: 30,
                          width: 30,
                          border: "1px solid rgba(18,53,46,.2)",
                          background: "white",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 13,
                        }}
                      >
                        📞
                      </a>
                      <button
                        className="danger"
                        onClick={() => handleDeleteEnquiry(e.id, e.name)}
                        title="Delete enquiry"
                        style={{ height: 30, width: 30 }}
                      >
                        ×
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {!filteredEnquiries.length && (
              <div className="admin-empty">
                <b>No client enquiries found</b>
                <p>When visitors fill out forms on the website, they will appear here instantly.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 3: ACTION HISTORY & AUDIT LOG */}
      {activeTab === "history" && (
        <section className="admin-workspace">
          <header className="admin-topbar">
            <div>
              <p>Audit trail & recovery</p>
              <h1>Action History</h1>
            </div>
            <button
              className="admin-primary"
              onClick={loadHistory}
              disabled={historyLoading}
            >
              <span>↻</span> {historyLoading ? "Refreshing..." : "Refresh log"}
            </button>
          </header>

          {notice && (
            <div className={`admin-notice ${notice.type}`}>
              {notice.text}
              <button onClick={() => setNotice(null)}>×</button>
            </div>
          )}

          <div className="admin-stats">
            <article>
              <span>Total operations</span>
              <b>{historyLogs.length.toString().padStart(2, "0")}</b>
              <small>All logged system events</small>
            </article>
            <article>
              <span>Today&apos;s activity</span>
              <b>
                {historyLogs
                  .filter(
                    (h) =>
                      new Date(h.createdAt).toDateString() ===
                      new Date().toDateString()
                  )
                  .length.toString()
                  .padStart(2, "0")}
              </b>
              <small>Modifications made today</small>
            </article>
            <article>
              <span>Reverted actions</span>
              <b>
                {historyLogs
                  .filter((h) => h.isUndone)
                  .length.toString()
                  .padStart(2, "0")}
              </b>
              <small>Successfully undone changes</small>
            </article>
            <article>
              <span>Active records</span>
              <b>
                {historyLogs
                  .filter((h) => !h.isUndone && h.actionType !== "UNDO")
                  .length.toString()
                  .padStart(2, "0")}
              </b>
              <small>Current irreversible/live edits</small>
            </article>
          </div>

          <div className="admin-list-card">
            <div className="admin-list-tools">
              <div>
                <h2>Audit timeline</h2>
                <p>Track all modifications with one-click undo and restore access.</p>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <select
                  value={historyFilter}
                  onChange={(e) =>
                    setHistoryFilter(
                      e.target.value as "ALL" | "opportunity" | "enquiry"
                    )
                  }
                  style={{
                    height: 40,
                    padding: "0 14px",
                    border: "1px solid rgba(18,53,46,.15)",
                    background: "white",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--admin-ink)",
                  }}
                >
                  <option value="ALL">All Activities ({historyLogs.length})</option>
                  <option value="opportunity">
                    Opportunities ({historyLogs.filter((h) => h.entityType === "opportunity").length})
                  </option>
                  <option value="enquiry">
                    Enquiries & Leads ({historyLogs.filter((h) => h.entityType === "enquiry").length})
                  </option>
                </select>

                <label className="admin-search">
                  <span>⌕</span>
                  <input
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search logs..."
                  />
                </label>
              </div>
            </div>

            <div className="admin-history-table-head">
              <span>Time & Admin</span>
              <span>Action</span>
              <span>Target</span>
              <span>Modification Details</span>
              <span style={{ textAlign: "right" }}>Undo Access</span>
            </div>

            <div className="admin-history-list">
              {filteredHistory.map((item) => (
                <article key={item.id} className="admin-history-row">
                  <div className="admin-hist-meta">
                    <span className="admin-hist-time-rel">
                      {formatTimeAgo(item.createdAt)}
                    </span>
                    <small className="admin-hist-time-exact">
                      {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                      })}
                    </small>
                    <span className="admin-hist-actor">{item.actorEmail}</span>
                  </div>

                  <div>{renderActionBadge(item.actionType)}</div>

                  <div className="admin-hist-entity">
                    <b>{item.entityName}</b>
                    <small>{item.entityType}</small>
                  </div>

                  <div className="admin-hist-desc">
                    <p>{item.description}</p>
                  </div>

                  <div className="admin-hist-actions">
                    {item.isUndone ? (
                      <span
                        className="admin-undone-badge"
                        title={
                          item.undoneAt
                            ? `Reverted on ${new Date(item.undoneAt).toLocaleString("en-IN")}`
                            : "Reverted"
                        }
                      >
                        ✓ Undone
                      </span>
                    ) : item.actionType !== "UNDO" ? (
                      <button
                        type="button"
                        className="admin-undo-btn"
                        disabled={undoingId === item.id}
                        onClick={() => handleUndo(item)}
                      >
                        {undoingId === item.id ? "Reverting…" : "↶ Undo"}
                      </button>
                    ) : (
                      <span className="admin-revert-badge">—</span>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {!filteredHistory.length && (
              <div className="admin-empty">
                {historyLogs.length > 0 ? (
                  <>
                    <b>
                      No records found for{" "}
                      {historyFilter === "enquiry"
                        ? "Enquiries & Leads"
                        : historyFilter === "opportunity"
                        ? "Opportunities"
                        : "current filter"}
                      {historySearch ? ` matching "${historySearch}"` : ""}
                    </b>
                    <p style={{ maxWidth: 460, margin: "10px auto 20px" }}>
                      You have {historyLogs.length} activity records logged in other categories. Click below to view all activity history.
                    </p>
                    <button
                      type="button"
                      className="admin-primary"
                      style={{ margin: "0 auto", display: "inline-flex" }}
                      onClick={() => {
                        setHistoryFilter("ALL");
                        setHistorySearch("");
                      }}
                    >
                      Show All Activities ({historyLogs.length})
                    </button>
                  </>
                ) : (
                  <>
                    <b>No activity history found</b>
                    <p>
                      Administrative actions such as creating or editing projects and changing enquiry statuses will be recorded here automatically.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FULL ENQUIRY DETAIL MODAL */}
      {selectedEnquiry && (
        <div
          className="admin-drawer-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedEnquiry(null);
          }}
        >
          <div
            className="admin-drawer"
            style={{ maxWidth: 540, height: "auto", margin: "auto", borderRadius: 4 }}
          >
            <header>
              <div>
                <p>Enquiry Details</p>
                <h2>{selectedEnquiry.name}</h2>
              </div>
              <button onClick={() => setSelectedEnquiry(null)}>×</button>
            </header>
            <div style={{ padding: "30px 34px" }}>
              <p>
                <b>Phone:</b> {selectedEnquiry.phone}
              </p>
              {selectedEnquiry.email && (
                <p>
                  <b>Email:</b> {selectedEnquiry.email}
                </p>
              )}
              <p>
                <b>Interest / Category:</b> {selectedEnquiry.category}
              </p>
              {selectedEnquiry.sourcePage && (
                <p>
                  <b>Source Page:</b> {selectedEnquiry.sourcePage}
                </p>
              )}
              <p>
                <b>Date Received:</b>{" "}
                {new Date(selectedEnquiry.createdAt).toLocaleString("en-IN")}
              </p>
              <div style={{ marginTop: 20 }}>
                <b>Client Message:</b>
                <p
                  style={{
                    background: "white",
                    padding: 16,
                    border: "1px solid rgba(18,53,46,.12)",
                    borderRadius: 3,
                    marginTop: 8,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedEnquiry.message || "No message provided."}
                </p>
              </div>
              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button-link"
                  style={{ background: "#2e7d58" }}
                >
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="button-link"
                  style={{ background: "var(--ink)" }}
                >
                  <span>Call {selectedEnquiry.phone}</span>
                </a>
              </div>
            </div>
            <footer>
              <button type="button" onClick={() => setSelectedEnquiry(null)}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* DRAWER FOR CREATING / EDITING OPPORTUNITY */}
      {draft && (
        <div
          className="admin-drawer-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDraft(null);
          }}
        >
          <form className="admin-drawer" onSubmit={save}>
            <header>
              <div>
                <p>{draft.id ? "Edit opportunity" : "New opportunity"}</p>
                <h2>{draft.id ? draft.name : "Create project"}</h2>
              </div>
              <button type="button" onClick={() => setDraft(null)} aria-label="Close editor">
                ×
              </button>
            </header>
            <div className="admin-form-scroll">
              <section>
                <h3>Project identity</h3>
                <div className="admin-form-grid">
                  <label>
                    Project name
                    <input
                      value={draft.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        if (!draft.id) {
                          const autoSlug = newName
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "");
                          const currentAuto = draft.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "");
                          if (!draft.slug || draft.slug === currentAuto) {
                            setDraft({ ...draft, name: newName, slug: autoSlug });
                            return;
                          }
                        }
                        setDraft({ ...draft, name: newName });
                      }}
                      required
                    />
                  </label>
                  <label>
                    URL slug
                    <input
                      value={draft.slug}
                      onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                      required
                      placeholder="project-name"
                    />
                  </label>
                  <label>
                    Category
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Land & plots</option>
                      <option>Investment</option>
                    </select>
                  </label>
                  <label>
                    Location
                    <input
                      value={draft.location}
                      onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Eyebrow text
                    <input
                      value={draft.eyebrow}
                      onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
                    />
                  </label>
                  <label>
                    Configuration
                    <input
                      value={draft.config}
                      onChange={(e) => setDraft({ ...draft, config: e.target.value })}
                      placeholder="3 & 4 BHK"
                    />
                  </label>
                </div>
              </section>
              <section>
                <h3>Story and status</h3>
                <label>
                  Tagline
                  <input
                    value={draft.tagline}
                    onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                  />
                </label>
                <label>
                  Summary
                  <textarea
                    rows={5}
                    value={draft.summary}
                    onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                  />
                </label>
                <div className="admin-form-grid">
                  <label>
                    Project status
                    <input
                      value={draft.status}
                      onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                    />
                  </label>
                  <label>
                    Display order
                    <input
                      type="number"
                      value={draft.sortOrder}
                      onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
                    />
                  </label>
                </div>
              </section>
              <section className="admin-images-section">
                <div className="admin-section-header">
                  <h3>Images</h3>
                  {uploadError && <p className="admin-upload-error">{uploadError}</p>}
                </div>

                {/* PRIMARY COVER IMAGE */}
                <div className="admin-field-group">
                  <div className="admin-label-row">
                    <span className="admin-field-label">
                      Primary Cover Image <span className="admin-req-badge">Required</span>
                    </span>
                    <button
                      type="button"
                      className="admin-link-toggle"
                      onClick={() => setManualUrlMode(!manualUrlMode)}
                    >
                      {manualUrlMode ? "← Switch to file upload" : "Enter URL manually"}
                    </button>
                  </div>

                  <input
                    ref={primaryInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                    style={{ display: "none" }}
                    onChange={handlePrimaryFileChange}
                  />

                  {manualUrlMode ? (
                    <input
                      type="url"
                      value={draft.image}
                      onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                      placeholder="https://… or /api/media/…"
                      className="admin-url-input"
                    />
                  ) : draft.image ? (
                    <div className="admin-image-preview-card">
                      <img
                        src={draft.image}
                        alt="Primary Preview"
                        className="admin-image-preview-img"
                      />
                      <div className="admin-image-preview-overlay">
                        <span className="admin-image-preview-tag">
                          {draft.image.startsWith("/api/media") ? "Uploaded Image" : "Primary Image"}
                        </span>
                        <div className="admin-preview-actions">
                          <button
                            type="button"
                            className="admin-preview-btn primary"
                            disabled={uploadingPrimary}
                            onClick={() => primaryInputRef.current?.click()}
                          >
                            {uploadingPrimary ? "Uploading…" : "🔄 Replace Image"}
                          </button>
                          <button
                            type="button"
                            className="admin-preview-btn danger"
                            disabled={uploadingPrimary}
                            onClick={() => setDraft({ ...draft, image: "" })}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`admin-image-upload-zone ${dragOverPrimary ? "is-drag-over" : ""}`}
                      onClick={() => !uploadingPrimary && primaryInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverPrimary(true);
                      }}
                      onDragLeave={() => setDragOverPrimary(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setDragOverPrimary(false);
                        const file = e.dataTransfer.files?.[0];
                        if (!file || !draft) return;
                        setUploadingPrimary(true);
                        setUploadError(null);
                        try {
                          const url = await uploadFile(file);
                          setDraft((prev) => (prev ? { ...prev, image: url } : null));
                        } catch (err) {
                          setUploadError(err instanceof Error ? err.message : "Upload failed.");
                        } finally {
                          setUploadingPrimary(false);
                        }
                      }}
                    >
                      {uploadingPrimary ? (
                        <div className="admin-upload-loader">
                          <div className="admin-spinner" />
                          <p>Uploading primary image to media library…</p>
                        </div>
                      ) : (
                        <>
                          <div className="admin-upload-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                              <circle cx="9" cy="9" r="2"/>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                          </div>
                          <b className="admin-upload-title">Click to browse or drag & drop image</b>
                          <p className="admin-upload-sub">Supports PNG, JPG, WebP, AVIF up to 12MB</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* GALLERY IMAGES */}
                <div className="admin-field-group" style={{ marginTop: 26 }}>
                  <div className="admin-label-row">
                    <div>
                      <span className="admin-field-label">Gallery Images</span>
                      <small className="admin-field-desc">
                        Showcase interior, exterior, architecture & amenities.
                      </small>
                    </div>
                    <button
                      type="button"
                      className="admin-upload-btn"
                      disabled={uploadingGallery}
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      {uploadingGallery ? "Uploading…" : "＋ Upload Photos"}
                    </button>
                  </div>

                  <input
                    ref={galleryInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                    style={{ display: "none" }}
                    onChange={handleGalleryFilesChange}
                  />

                  {uploadingGallery && (
                    <div className="admin-upload-loader-small">
                      <div className="admin-spinner small" />
                      <span>Uploading gallery photos to media library…</span>
                    </div>
                  )}

                  {galleryItems.length > 0 ? (
                    <div className="admin-gallery-list">
                      {galleryItems.map((item, index) => (
                        <div key={`${item.image}-${index}`} className="admin-gallery-row">
                          <img
                            src={item.image}
                            alt=""
                            className="admin-gallery-thumb"
                          />
                          <div className="admin-gallery-input-wrap">
                            <label className="admin-gallery-item-label">
                              Caption / Label
                              <input
                                type="text"
                                value={item.label}
                                placeholder="e.g. Grand Entrance, Living Room"
                                onChange={(e) => updateGalleryLabel(index, e.target.value)}
                              />
                            </label>
                          </div>
                          <div className="admin-gallery-actions">
                            <button
                              type="button"
                              title="Move Up"
                              disabled={index === 0}
                              onClick={() => moveGalleryItem(index, -1)}
                              className="admin-gallery-action-btn"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              title="Move Down"
                              disabled={index === galleryItems.length - 1}
                              onClick={() => moveGalleryItem(index, 1)}
                              className="admin-gallery-action-btn"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              title="Remove"
                              onClick={() => removeGalleryItem(index)}
                              className="admin-gallery-action-btn danger"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="admin-gallery-empty-zone"
                      onClick={() => !uploadingGallery && galleryInputRef.current?.click()}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                        <path d="M12 12v9"/>
                        <path d="m16 16-4-4-4 4"/>
                      </svg>
                      <span>No gallery images uploaded yet. Click &quot;＋ Upload Photos&quot; to select images.</span>
                    </div>
                  )}
                </div>
              </section>
              <section>
                <h3>Highlights</h3>
                <label>
                  Project highlights <small>One per line: Title | Description</small>
                  <textarea
                    rows={6}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    placeholder="Prime location | Close to everyday conveniences."
                  />
                </label>
              </section>
              <section className="admin-switches">
                <label>
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                  />
                  <span>
                    <b>Published</b>
                    <small>Visible on the public website</small>
                  </span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                  />
                  <span>
                    <b>Featured</b>
                    <small>Prioritize this project in listings</small>
                  </span>
                </label>
              </section>
            </div>
            <footer>
              <button type="button" onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className="admin-primary" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save opportunity"}
              </button>
            </footer>
          </form>
        </div>
      )}
    </main>
  );
}
