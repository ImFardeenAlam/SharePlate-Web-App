import { useState, useRef, useCallback } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen = "onboarding" | "login" | "signup" | "home" | "detail" | "post" | "myposts" | "requests" | "profile" | "search" | "notifications"

type Status = "available" | "requested" | "accepted" | "rejected" | "expired"

interface FoodPost {
  id: string
  title: string
  quantity: string
  location: string
  timeWindow: string
  notes: string
  photo: string
  status: Status
  poster: string
  urgent?: boolean
  category: string
}

interface Request {
  id: string
  postId: string
  postTitle: string
  requester: string
  requesterAvatar: string
  time: string
  direction: "sent" | "received"
  status: Status
  acceptAnimated?: boolean
}

interface Notification {
  id: string
  text: string
  time: string
  read: boolean
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FOOD_POSTS: FoodPost[] = [
  {
    id: "1",
    title: "Dhaka Shahi Kacchi Biryani with Aloo & Egg",
    quantity: "~20 portions",
    location: "Tejgaon Link Road, near Shanta Western Tower, Dhaka",
    timeWindow: "Today until 7 PM",
    notes:
      "Slow-cooked mutton dum biryani with whole potatoes and boiled eggs. Full trays available.",
    photo:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&h=500&fit=crop&auto=format",
    status: "available",
    poster: "MD. Sajjadul Islam",
    urgent: true,
    category: "Biryani & Rice",
  },
  {
    id: "2",
    title: "Bhuna Khichuri & Beef Rezala",
    quantity: "~15 servings",
    location: "Ahsanullah University Road, Tejgaon I/A, Dhaka",
    timeWindow: "Pickup by 8 PM tonight",
    notes:
      "Rainy-day khichuri with rich beef rezala gravy. Containers provided.",
    photo:
      "https://images.unsplash.com/photo-1630409349416-24884761a307?w=600&h=360&fit=crop&auto=format",
    status: "requested",
    poster: "MD. Fardeen Alam Maruf",
    category: "Hot Meals",
  },
  {
    id: "3",
    title: "Festive Morog Polao & Spiced Dim Roast",
    quantity: "~12 servings",
    location: "7 Kunipara, Tejgaon, Dhaka",
    timeWindow: "This evening, before Maghrib",
    notes:
      "Leftover from a family dawat. Fragrant chicken polao with spiced egg roast.",
    photo:
      "https://images.unsplash.com/photo-1742599361451-3f6608b212f0?w=600&h=360&fit=crop&auto=format",
    status: "available",
    poster: "Zarin Saima",
    category: "Festive Dishes",
  },
  {
    id: "4",
    title: "Traditional Shorshe Ilish with Steamed Rice",
    quantity: "~10 portions",
    location: "Farmgate – Tejgaon Overpass, Dhaka",
    timeWindow: "Available NOW — 5 PM cutoff",
    notes:
      "Hilsa in mustard-turmeric gravy. Freshly made, rice included. Bring your own container.",
    photo:
      "https://images.unsplash.com/photo-1654863404432-cac67587e25d?w=800&h=500&fit=crop&auto=format",
    status: "available",
    poster: "MD. Fardeen Alam Maruf",
    urgent: true,
    category: "Fish & Seafood",
  },
  {
    id: "5",
    title: "Traditional Mishti Platter — Sondesh",
    quantity: "~30 pieces",
    location: "Nabisco Mor, Shaheed Tajuddin Ahmed Ave, Tejgaon, Dhaka",
    timeWindow: "Anytime today",
    notes:
      "Surplus from Eid celebration. Kept chilled. Mix of chomchom and rosogolla.",
    photo:
      "https://images.unsplash.com/photo-1695568181363-af5c78f4d059?w=600&h=360&fit=crop&auto=format",
    status: "accepted",
    poster: "Zarin Saima",
    category: "Sweets & Mishti",
  },
  {
    id: "6",
    title: "Crispy Fuchka & Tangy Spiced Chotpoti",
    quantity: "~50 pieces + 2 kg chotpoti",
    location: "Tejgaon Commercial Area, Link Road, Dhaka",
    timeWindow: "Today 4–6 PM only",
    notes:
      "Street-style fuchka shells and a big batch of chotpoti with tamarind water. Serve yourself.",
    photo:
      "https://images.unsplash.com/photo-1614435842039-e842b002c342?w=600&h=360&fit=crop&auto=format",
    status: "available",
    poster: "MD. Sajjadul Islam",
    category: "Street Food",
  },
]

const REQUESTS: Request[] = [
  {
    id: "r1",
    postId: "1",
    postTitle: "Dhaka Shahi Kacchi Biryani",
    requester: "MD. Fardeen Alam Maruf",
    requesterAvatar: "",
    time: "2h ago",
    direction: "received",
    status: "requested",
  },
  {
    id: "r2",
    postId: "5",
    postTitle: "Traditional Mishti Platter",
    requester: "You → Zarin Saima",
    requesterAvatar: "",
    time: "Yesterday",
    direction: "sent",
    status: "accepted",
  },
  {
    id: "r3",
    postId: "2",
    postTitle: "Bhuna Khichuri & Beef Rezala",
    requester: "Zarin Saima",
    requesterAvatar: "",
    time: "30 min ago",
    direction: "received",
    status: "requested",
  },
]

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    text: "Your request for Traditional Mishti Platter was accepted by Zarin Saima.",
    time: "1h ago",
    read: false,
  },
  {
    id: "n2",
    text: "MD. Fardeen Alam Maruf requested your Dhaka Shahi Kacchi Biryani post.",
    time: "2h ago",
    read: false,
  },
  {
    id: "n3",
    text: "New post near Tejgaon Link Road: Festive Morog Polao & Spiced Dim Roast.",
    time: "4h ago",
    read: true,
  },
  {
    id: "n4",
    text: "Your Dhaka Shahi Kacchi Biryani post expires in 2 hours.",
    time: "Yesterday",
    read: true,
  },
]

const ONBOARDING_SLIDES = [
  {
    emoji: "🌿",
    headline: "Good food deserves\na second chance.",
    body: "SharePlate connects people and organizations with surplus food to those who can use it — right in your neighbourhood.",
    bg: "#24402C",
    accent: "#F0A63A",
  },
  {
    emoji: "📌",
    headline: "Post it.\nBrowse it.\nShare it.",
    body: "Snap a photo, add the details, and your surplus goes live on the community board. Neighbours nearby can request it in seconds.",
    bg: "#F0A63A",
    accent: "#24402C",
  },
  {
    emoji: "🤝",
    headline: "Less waste.\nMore community.",
    body: "Every shared meal is one less thing that goes to landfill. Join hundreds of neighbours already at the table.",
    bg: "#EFF2E9",
    accent: "#24402C",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusStamp({
  status,
  animate,
}: {
  status: Status
  animate?: boolean
}) {
  const config: Record<Status, { label: string color: string bg: string }> = {
    available: { label: "Available", color: "#24402C", bg: "transparent" },
    requested: { label: "Requested", color: "#7A5568", bg: "transparent" },
    accepted: { label: "Accepted", color: "#F0A63A", bg: "transparent" },
    rejected: { label: "Rejected", color: "#9b9690", bg: "transparent" },
    expired: { label: "Expired", color: "#9b9690", bg: "transparent" },
  }
  const c = config[status]
  return (
    <span
      className={`stamp ${animate ? "stamp-thud" : ""}`}
      style={{ color: c.color, borderColor: c.color }}
    >
      {c.label}
    </span>
  )
}

function getInitials(name: string) {
  const parts = name
    .replace(/^(MD\.|Dr\.|Mr\.|Ms\.)\s*/i, "")
    .trim()
    .split(/\s+/)
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

const AVATAR_COLORS: Record<string, {
  bg: string
  border: string
  text: string
}> = {
  SI: { bg: "#24402C", border: "#F0A63A", text: "#F0A63A" },
  FA: { bg: "#7A5568", border: "#C9D2BC", text: "#EFF2E9" },
  ZS: { bg: "#2d5a3d", border: "#C9D2BC", text: "#EFF2E9" },
}

function Avatar({
  src,
  name,
  size = 40,
}: {
  src?: string
  name: string
  size?: number
}) {
  const initials = getInitials(name)
  const colors = AVATAR_COLORS[initials] ?? {
    bg: "#C9D2BC",
    border: "#24402C",
    text: "#24402C",
  }
  return src ? (
    <img
      src={src}
      alt={name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colors.bg,
        border: `${Math.max(2, size * 0.05)}px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 700,
        color: colors.text,
        fontFamily: "'Public Sans', sans-serif",
        letterSpacing: "0.02em",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

// ─── Screens ─────────────────────────────────────────────────────────────────

function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0)
  const s = ONBOARDING_SLIDES[slide]
  const isLast = slide === ONBOARDING_SLIDES.length - 1

  return (
    <div
      className="flex flex-col h-full transition-colors duration-500"
      style={{ background: s.bg, padding: "0 28px" }}
    >
      {/* Skip */}
      <div className="flex justify-end pt-14 pb-4">
        <button
          onClick={onDone}
          style={{
            color: slide === 1 ? "#24402C" : "#C9D2BC",
            fontFamily: "'Public Sans', sans-serif",
            fontSize: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Skip
        </button>
      </div>

      {/* Emoji */}
      <div
        style={{
          fontSize: 72,
          textAlign: "center",
          marginTop: 40,
          marginBottom: 32,
        }}
      >
        {s.emoji}
      </div>

      {/* Headline */}
      <h1
        className="font-display"
        style={{
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1.15,
          color: slide === 1 ? "#24402C" : slide === 2 ? "#24402C" : "#EFF2E9",
          whiteSpace: "pre-line",
          marginBottom: 20,
        }}
      >
        {s.headline}
      </h1>

      {/* Body */}
      <p
        style={{
          fontFamily: "'Public Sans', sans-serif",
          fontSize: 16,
          lineHeight: 1.6,
          color: slide === 1 ? "#33312C" : slide === 2 ? "#33312C" : "#C9D2BC",
          marginBottom: "auto",
        }}
      >
        {s.body}
      </p>

      {/* Dots + CTA */}
      <div style={{ paddingBottom: 52 }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          {ONBOARDING_SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: s.accent,
                opacity: i === slide ? 1 : 0.3,
                transition: "all 0.3s",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => (isLast ? onDone() : setSlide(slide + 1))}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 12,
            background: s.accent,
            color: slide === 1 ? "#EFF2E9" : "#24402C",
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
          }}
        >
          {isLast ? "Get started" : "Next"}
        </button>
      </div>
    </div>
  )
}

function LoginScreen({
  onLogin,
  onSignup,
}: {
  onLogin: () => void
  onSignup: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const inputStyle = {
    width: "100%",
    height: 50,
    borderRadius: 10,
    border: "1.5px solid #C9D2BC",
    padding: "0 16px",
    fontFamily: "'Public Sans', sans-serif",
    fontSize: 16,
    background: "#fff",
    color: "#33312C",
    outline: "none",
  }

  const labelStyle = {
    fontFamily: "'Public Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#24402C",
    marginBottom: 6,
    display: "block",
    letterSpacing: "0.04em",
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#EFF2E9", padding: "0 28px" }}
    >
      <div style={{ paddingTop: 72, marginBottom: 40 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🌿</div>
        <h1
          className="font-display"
          style={{
            fontSize: 34,
            fontWeight: 600,
            color: "#24402C",
            lineHeight: 1.15,
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontFamily: "'Public Sans', sans-serif",
            fontSize: 15,
            color: "#7A5568",
            marginTop: 6,
          }}
        >
          Log in to your Tejgaon community account
        </p>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}
      >
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />
          <button
            style={{
              background: "none",
              border: "none",
              color: "#7A5568",
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 13,
              cursor: "pointer",
              marginTop: 8,
              padding: 0,
            }}
          >
            Forgot password?
          </button>
        </div>

        <button
          onClick={onLogin}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 12,
            background: "#24402C",
            color: "#EFF2E9",
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Log in
        </button>

        <div
          style={{ textAlign: "center", marginTop: "auto", paddingBottom: 40 }}
        >
          <span
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 14,
              color: "#7A5568",
            }}
          >
            Don{"'"}t have an account?{" "}
          </span>
          <button
            onClick={onSignup}
            style={{
              background: "none",
              border: "none",
              color: "#24402C",
              fontFamily: "'Public Sans', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

function SignupScreen({
  onDone,
  onBack,
}: {
  onDone: () => void
  onBack: () => void
}) {
  const [role, setRole] =
    useState<"household" | "student" | "restaurant" | "ngo">("household")

  const inputStyle = {
    width: "100%",
    height: 50,
    borderRadius: 10,
    border: "1.5px solid #C9D2BC",
    padding: "0 16px",
    fontFamily: "'Public Sans', sans-serif",
    fontSize: 16,
    background: "#fff",
    color: "#33312C",
    outline: "none",
  }

  const labelStyle = {
    fontFamily: "'Public Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#24402C",
    marginBottom: 6,
    display: "block",
    letterSpacing: "0.04em",
  }

  const roles = [
    { key: "household", label: "Household" },
    { key: "student", label: "Student" },
    { key: "restaurant", label: "Restaurant / Cafe" },
    { key: "ngo", label: "NGO / Community Org" },
  ] as const

  return (
    <div style={{ background: "#EFF2E9", height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "0 28px 40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingTop: 56,
            marginBottom: 32,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginRight: 12,
              padding: 0,
            }}
          >
            <ChevronLeft color="#24402C" />
          </button>
          <h1
            className="font-display"
            style={{ fontSize: 30, fontWeight: 600, color: "#24402C" }}
          >
            Create account
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={labelStyle}>Full name</label>
            <input placeholder="MD. Sajjadul Islam" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="sajjadul.islam@example.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              type="tel"
              placeholder="+880 1712-123123"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>I am a…</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  style={{
                    height: 44,
                    borderRadius: 8,
                    border: `1.5px solid ${
                      role === r.key ? "#24402C" : "#C9D2BC"
                    }`,
                    background: role === r.key ? "#24402C" : "#fff",
                    color: role === r.key ? "#EFF2E9" : "#33312C",
                    fontFamily: "'Public Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onDone}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 12,
              background: "#F0A63A",
              color: "#24402C",
              fontFamily: "'Public Sans', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  )
}

function HomeFeed({
  onOpenPost,
  onSearch,
}: {
  onOpenPost: (p: FoodPost) => void
  onSearch: () => void
}) {
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const [pullDistance, setPullDistance] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const dist = Math.max(
      0,
      Math.min(80, e.touches[0].clientY - startY.current),
    )
    setPullDistance(dist)
  }

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      setRefreshing(true)
      setTimeout(() => {
        setRefreshing(false)
        setPullDistance(0)
      }, 1200)
    } else {
      setPullDistance(0)
    }
  }

  return (
    <div
      style={{ height: "100%", overflowY: "auto", background: "#EFF2E9" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        style={{
          height: pullDistance,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          transition: pullDistance === 0 ? "height 0.3s" : "none",
        }}
      >
        {(pullDistance > 30 || refreshing) && (
          <div
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 12,
              color: "#7A5568",
            }}
          >
            {refreshing ? "Refreshing…" : "Release to refresh"}
          </div>
        )}
      </div>

      {/* Header */}
      <div
        style={{
          padding: "16px 20px 0",
          position: "sticky",
          top: 0,
          background: "#EFF2E9",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 13,
                color: "#7A5568",
                margin: 0,
              }}
            >
              Good morning
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#24402C",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              What{"'"}s nearby
            </h2>
          </div>
          <Avatar name="MD. Sajjadul Islam" size={40} />
        </div>

        {/* Search bar */}
        <button
          onClick={onSearch}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 10,
            border: "1.5px solid #C9D2BC",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 8,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          <SearchIcon />
          <span
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 15,
              color: "#9b9690",
            }}
          >
            Search food near you…
          </span>
        </button>

        {/* Location chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            paddingBottom: 12,
          }}
        >
          <LocationIcon />
          <span
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 12,
              color: "#7A5568",
              fontWeight: 600,
            }}
          >
            Tejgaon, Dhaka • 2 km radius
          </span>
        </div>

        <div style={{ height: 1, background: "#C9D2BC" }} />
      </div>

      {/* Feed */}
      <div style={{ padding: "16px 20px 16px" }}>
        {FOOD_POSTS.map((post) => (
          <FoodCard key={post.id} post={post} onOpen={() => onOpenPost(post)} />
        ))}
      </div>
    </div>
  )
}

function FoodCard({ post, onOpen }: { post: FoodPost onOpen: () => void }) {
  const urgent = post.urgent

  return (
    <div
      onClick={onOpen}
      style={{
        background: "#fff",
        borderRadius: 14,
        marginBottom: urgent ? 20 : 14,
        overflow: "hidden",
        borderLeft: urgent ? "4px solid #F0A63A" : "none",
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(36,64,44,0.07)",
      }}
    >
      {urgent && (
        <div
          style={{
            height: urgent ? 180 : 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={post.photo}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <StatusStamp status={post.status} />
          </div>
        </div>
      )}
      <div style={{ padding: "14px 16px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 11,
                color: "#7A5568",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                margin: "0 0 4px",
              }}
            >
              {post.category}
            </p>
            <h3
              className={urgent ? "font-display" : ""}
              style={{
                fontSize: urgent ? 20 : 16,
                fontWeight: urgent ? 600 : 600,
                color: "#24402C",
                margin: "0 0 6px",
                lineHeight: 1.25,
                fontFamily: urgent ? undefined : "'Public Sans', sans-serif",
              }}
            >
              {post.title}
            </h3>
          </div>
          {!urgent && (
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              <StatusStamp status={post.status} />
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 13,
              color: "#7A5568",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <QuantityIcon /> {post.quantity}
          </span>
          <span
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 13,
              color: "#7A5568",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <ClockIcon /> {post.timeWindow}
          </span>
        </div>
        {urgent && (
          <p
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 12,
              color: "#7A5568",
              margin: "8px 0 0",
            }}
          >
            📍 {post.location}
          </p>
        )}
      </div>
    </div>
  )
}

function FoodDetail({
  post,
  onBack,
  onRequest,
}: {
  post: FoodPost
  onBack: () => void
  onRequest: () => void
}) {
  const [requested, setRequested] = useState(false)
  const [stampAnim, setStampAnim] = useState(false)

  const handleRequest = () => {
    setRequested(true)
    setStampAnim(true)
    onRequest()
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        background: "#EFF2E9",
        position: "relative",
      }}
    >
      {/* Photo */}
      <div style={{ height: 280, position: "relative", background: "#C9D2BC" }}>
        <img
          src={post.photo}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%)",
          }}
        />
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 48,
            left: 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(239,242,233,0.9)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft color="#24402C" />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 24px 100px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h1
            className="font-display"
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#24402C",
              lineHeight: 1.2,
              flex: 1,
              marginRight: 12,
            }}
          >
            {post.title}
          </h1>
          <div style={{ flexShrink: 0, marginTop: 6 }}>
            <StatusStamp
              status={requested ? "requested" : post.status}
              animate={stampAnim}
            />
          </div>
        </div>

        <p
          style={{
            fontFamily: "'Public Sans', sans-serif",
            fontSize: 13,
            color: "#7A5568",
            fontWeight: 600,
            marginBottom: 20,
            letterSpacing: "0.04em",
          }}
        >
          Posted by {post.poster}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 24,
          }}
        >
          {[
            { icon: "📦", label: "Quantity", value: post.quantity },
            { icon: "📍", label: "Location", value: post.location },
            { icon: "⏰", label: "Available", value: post.timeWindow },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", gap: 12 }}>
              <span style={{ fontSize: 18, width: 24, flexShrink: 0 }}>
                {row.icon}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#7A5568",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {row.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: 15,
                    color: "#33312C",
                    margin: "2px 0 0",
                  }}
                >
                  {row.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {post.notes && (
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "14px 16px",
              borderLeft: "3px solid #C9D2BC",
            }}
          >
            <p
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "#7A5568",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              Notes
            </p>
            <p
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 15,
                color: "#33312C",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {post.notes}
            </p>
          </div>
        )}
      </div>

      {/* Sticky bottom */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#EFF2E9",
          padding: "12px 24px 24px",
          borderTop: "1px solid #C9D2BC",
        }}
      >
        <button
          onClick={handleRequest}
          disabled={requested}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 12,
            background: requested ? "#C9D2BC" : "#F0A63A",
            color: requested ? "#7A5568" : "#24402C",
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            border: "none",
            cursor: requested ? "default" : "pointer",
            transition: "background 0.3s",
          }}
        >
          {requested ? "Request sent ✓" : "Request this food"}
        </button>
      </div>
    </div>
  )
}

function PostFood({
  onBack,
  onPost,
}: {
  onBack: () => void
  onPost: () => void
}) {
  const [photo, setPhoto] = useState<string | null>(null)

  const inputStyle = {
    width: "100%",
    height: 50,
    borderRadius: 10,
    border: "1.5px solid #C9D2BC",
    padding: "0 16px",
    fontFamily: "'Public Sans', sans-serif",
    fontSize: 16,
    background: "#fff",
    color: "#33312C",
    outline: "none",
  }

  const labelStyle = {
    fontFamily: "'Public Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#24402C",
    marginBottom: 6,
    display: "block",
    letterSpacing: "0.04em",
  }

  const samplePhotos = [
    "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop&auto=format",
  ]

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#EFF2E9" }}>
      <div style={{ padding: "0 24px 40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingTop: 56,
            marginBottom: 28,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginRight: 12,
              padding: 0,
            }}
          >
            <ChevronLeft color="#24402C" />
          </button>
          <h1
            className="font-display"
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#24402C",
              margin: 0,
            }}
          >
            Post surplus food
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Photo picker */}
          <div>
            <label style={labelStyle}>Food photo</label>
            {photo ? (
              <div
                style={{
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  height: 180,
                }}
              >
                <img
                  src={photo}
                  alt="Food"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={() => setPhoto(null)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.5)",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() =>
                    setPhoto(
                      samplePhotos[
                        Math.floor(Math.random() * samplePhotos.length)
                      ],
                    )
                  }
                  style={{
                    flex: 1,
                    height: 90,
                    borderRadius: 10,
                    border: "1.5px dashed #C9D2BC",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 24 }}>📷</span>
                  <span
                    style={{
                      fontFamily: "'Public Sans', sans-serif",
                      fontSize: 12,
                      color: "#7A5568",
                      fontWeight: 600,
                    }}
                  >
                    Camera
                  </span>
                </button>
                <button
                  onClick={() =>
                    setPhoto(
                      samplePhotos[
                        Math.floor(Math.random() * samplePhotos.length)
                      ],
                    )
                  }
                  style={{
                    flex: 1,
                    height: 90,
                    borderRadius: 10,
                    border: "1.5px dashed #C9D2BC",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 24 }}>🖼️</span>
                  <span
                    style={{
                      fontFamily: "'Public Sans', sans-serif",
                      fontSize: 12,
                      color: "#7A5568",
                      fontWeight: 600,
                    }}
                  >
                    Gallery
                  </span>
                </button>
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Food name</label>
            <input
              placeholder="e.g. Sourdough loaves, lentil soup"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Quantity</label>
            <input
              placeholder="e.g. 8 loaves, ~10 servings"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Pickup location</label>
            <input
              placeholder="Street address or landmark"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Available until</label>
            <input
              placeholder="e.g. Today 6 PM, This weekend"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea
              placeholder="Dietary info, allergens, handling notes…"
              style={{
                ...inputStyle,
                height: 90,
                padding: "12px 16px",
                resize: "none" as const,
              }}
            />
          </div>

          <button
            onClick={onPost}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 12,
              background: "#F0A63A",
              color: "#24402C",
              fontFamily: "'Public Sans', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            Post it
          </button>
        </div>
      </div>
    </div>
  )
}

function MyPosts({ onBack }: { onBack: () => void }) {
  const [posts, setPosts] = useState(FOOD_POSTS.slice(0, 3))
  const [swipedId, setSwipedId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id))
    setSwipedId(null)
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#EFF2E9" }}>
      <div style={{ padding: "0 24px 40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingTop: 56,
            marginBottom: 24,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginRight: 12,
              padding: 0,
            }}
          >
            <ChevronLeft color="#24402C" />
          </button>
          <h1
            className="font-display"
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#24402C",
              margin: 0,
            }}
          >
            My posts
          </h1>
        </div>

        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              position: "relative",
              marginBottom: 12,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Swipe actions */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "stretch",
              }}
            >
              <button
                onClick={() => setSwipedId(null)}
                style={{
                  width: 80,
                  background: "#7A5568",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Public Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                style={{
                  width: 80,
                  background: "#c0392b",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Public Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                Delete
              </button>
            </div>
            <div
              onClick={() => setSwipedId(swipedId === post.id ? null : post.id)}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                gap: 14,
                alignItems: "center",
                position: "relative",
                transform:
                  swipedId === post.id ? "translateX(-160px)" : "translateX(0)",
                transition: "transform 0.25s ease",
                cursor: "pointer",
              }}
            >
              <img
                src={post.photo}
                alt={post.title}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#24402C",
                    margin: "0 0 4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: 13,
                    color: "#7A5568",
                    margin: "0 0 6px",
                  }}
                >
                  {post.timeWindow}
                </p>
                <StatusStamp status={post.status} />
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#7A5568",
              fontFamily: "'Public Sans', sans-serif",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📌</div>
            <p>No posts yet. Share your surplus!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RequestsScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"received" | "sent">("received")
  const [requests, setRequests] = useState(REQUESTS)
  const [swipedId, setSwipedId] = useState<string | null>(null)

  const filtered = requests.filter((r) => r.direction === tab)

  const handleAccept = (id: string) => {
    setRequests((reqs) =>
      reqs.map((r) =>
        r.id === id
          ? { ...r, status: "accepted" as Status, acceptAnimated: true }
          : r,
      ),
    )
    setSwipedId(null)
  }

  const handleReject = (id: string) => {
    setRequests((reqs) =>
      reqs.map((r) =>
        r.id === id ? { ...r, status: "rejected" as Status } : r,
      ),
    )
    setSwipedId(null)
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#EFF2E9" }}>
      <div style={{ padding: "0 0 40px" }}>
        <div style={{ padding: "56px 24px 16px" }}>
          <h1
            className="font-display"
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#24402C",
              margin: "0 0 16px",
            }}
          >
            Requests
          </h1>

          {/* Segmented control */}
          <div
            style={{
              display: "flex",
              background: "#C9D2BC",
              borderRadius: 10,
              padding: 3,
            }}
          >
            {(["received", "sent"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  height: 38,
                  borderRadius: 8,
                  border: "none",
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? "#24402C" : "#7A5568",
                  fontFamily: "'Public Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 24px" }}>
          {filtered.map((req) => (
            <div
              key={req.id}
              style={{
                position: "relative",
                marginBottom: 12,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {tab === "received" && req.status === "requested" && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <button
                    onClick={() => handleAccept(req.id)}
                    style={{
                      width: "50%",
                      background: "#F0A63A",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Public Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#24402C",
                    }}
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    style={{
                      width: "50%",
                      background: "#7A5568",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Public Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#fff",
                      marginLeft: "auto",
                    }}
                  >
                    ✗ Reject
                  </button>
                </div>
              )}
              <div
                onClick={() =>
                  tab === "received" && req.status === "requested"
                    ? setSwipedId(swipedId === req.id ? null : req.id)
                    : null
                }
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  transform:
                    swipedId === req.id &&
                    tab === "received" &&
                    req.status === "requested"
                      ? "translateX(60%) translateX(-60%)"
                      : "translateX(0)",
                  transition: "transform 0.25s ease",
                  position: "relative",
                  cursor:
                    tab === "received" && req.status === "requested"
                      ? "pointer"
                      : "default",
                }}
              >
                <Avatar
                  src={req.requesterAvatar}
                  name={req.requester}
                  size={44}
                />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "'Public Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#33312C",
                      margin: "0 0 2px",
                    }}
                  >
                    {req.requester}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Public Sans', sans-serif",
                      fontSize: 13,
                      color: "#7A5568",
                      margin: "0 0 6px",
                    }}
                  >
                    {tab === "received" ? "wants" : "requested"}:{" "}
                    {req.postTitle}
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <StatusStamp
                      status={req.status}
                      animate={req.acceptAnimated}
                    />
                    <span
                      style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontSize: 11,
                        color: "#9b9690",
                      }}
                    >
                      {req.time}
                    </span>
                  </div>
                </div>
                {tab === "received" && req.status === "requested" && (
                  <div
                    style={{
                      fontFamily: "'Public Sans', sans-serif",
                      fontSize: 11,
                      color: "#9b9690",
                    }}
                  >
                    ← swipe
                  </div>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "#7A5568",
                fontFamily: "'Public Sans', sans-serif",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
              <p>No {tab} requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileScreen() {
  const [editing, setEditing] = useState(false)

  const inputStyle = {
    width: "100%",
    height: 48,
    borderRadius: 10,
    border: `1.5px solid ${editing ? "#C9D2BC" : "transparent"}`,
    padding: "0 16px",
    fontFamily: "'Public Sans', sans-serif",
    fontSize: 15,
    background: editing ? "#fff" : "transparent",
    color: "#33312C",
    outline: "none",
  }

  const labelStyle = {
    fontFamily: "'Public Sans', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color: "#7A5568",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    marginBottom: 4,
    display: "block",
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#EFF2E9" }}>
      <div style={{ padding: "56px 24px 40px" }}>
        {/* Avatar area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <Avatar name="MD. Sajjadul Islam" size={88} />
          <h2
            className="font-display"
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#24402C",
              margin: "12px 0 4px",
            }}
          >
            MD. Sajjadul Islam
          </h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "#24402C",
              color: "#EFF2E9",
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            <span
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Tejgaon Community
            </span>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {[
            { label: "Posts", value: "12" },
            { label: "Shared", value: "34 kg" },
            { label: "Requests", value: "8" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "14px 12px",
                textAlign: "center",
              }}
            >
              <p
                className="font-display"
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#24402C",
                  margin: "0 0 2px",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "'Public Sans', sans-serif",
                  fontSize: 11,
                  color: "#7A5568",
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Fields */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "20px 20px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#24402C",
                margin: 0,
              }}
            >
              Account info
            </h3>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                background: "none",
                border: "none",
                color: "#F0A63A",
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {editing ? "Save" : "Edit"}
            </button>
          </div>
          {[
            { label: "Full name", value: "MD. Sajjadul Islam", type: "text" },
            {
              label: "Email",
              value: "sajjadul.islam@example.com",
              type: "email",
            },
            { label: "Phone", value: "+880 1712-123123", type: "tel" },
            {
              label: "Address",
              value: "Plot 14, Tejgaon Industrial Area, Dhaka - 1208",
              type: "text",
            },
          ].map((field) => (
            <div key={field.label} style={{ marginBottom: 16 }}>
              <label style={labelStyle}>{field.label}</label>
              <input
                type={field.type}
                defaultValue={field.value}
                disabled={!editing}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        <button
          style={{
            width: "100%",
            height: 48,
            borderRadius: 10,
            border: "1.5px solid #C9D2BC",
            background: "transparent",
            color: "#c0392b",
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>
    </div>
  )
}

function SearchScreen() {
  const [query, setQuery] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [radius, setRadius] = useState(2)

  const results =
    query.length > 0
      ? FOOD_POSTS.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()),
        )
      : []

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        background: "#EFF2E9",
        position: "relative",
      }}
    >
      <div
        style={{
          padding: "56px 24px 24px",
          position: "sticky",
          top: 0,
          background: "#EFF2E9",
          zIndex: 5,
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#24402C",
            margin: "0 0 16px",
          }}
        >
          Search
        </h1>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <SearchIcon />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bread, soup, produce…"
              style={{
                width: "100%",
                height: 48,
                borderRadius: 10,
                border: "1.5px solid #C9D2BC",
                padding: "0 16px 0 40px",
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 15,
                background: "#fff",
                outline: "none",
                color: "#33312C",
              }}
            />
          </div>
          <button
            onClick={() => setShowFilter(true)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              border: "1.5px solid #C9D2BC",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🎛️
          </button>
        </div>
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        {query.length === 0 ? (
          /* Empty corkboard */
          <div style={{ textAlign: "center", paddingTop: 48 }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "4/3",
                background: "#D4A96A22",
                borderRadius: 16,
                border: "2px dashed #C9D2BC",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: 24,
              }}
            >
              <span style={{ fontSize: 48 }}>📌</span>
              <p
                className="font-display"
                style={{
                  fontSize: 20,
                  color: "#24402C",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                The corkboard is empty.
              </p>
              <p
                style={{
                  fontFamily: "'Public Sans', sans-serif",
                  fontSize: 14,
                  color: "#7A5568",
                  margin: 0,
                }}
              >
                Type something to search the community board.
              </p>
            </div>
          </div>
        ) : results.length === 0 ? (
          <p
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 15,
              color: "#7A5568",
              textAlign: "center",
              paddingTop: 40,
            }}
          >
            No results for "{query}"
          </p>
        ) : (
          results.map((post) => (
            <div
              key={post.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 12,
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <img
                src={post.photo}
                alt={post.title}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#24402C",
                    margin: "0 0 2px",
                  }}
                >
                  {post.title}
                </p>
                <p
                  style={{
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: 12,
                    color: "#7A5568",
                    margin: "0 0 6px",
                  }}
                >
                  {post.location}
                </p>
                <StatusStamp status={post.status} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter bottom sheet */}
      {showFilter && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(36,64,44,0.4)",
            zIndex: 20,
            display: "flex",
            alignItems: "flex-end",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowFilter(false)
          }}
        >
          <div
            style={{
              width: "100%",
              background: "#EFF2E9",
              borderRadius: "20px 20px 0 0",
              padding: "24px 28px 40px",
            }}
            className="fade-up"
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: "#C9D2BC",
                borderRadius: 2,
                margin: "0 auto 24px",
              }}
            />
            <h3
              className="font-display"
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#24402C",
                marginBottom: 24,
              }}
            >
              Location filter
            </h3>

            <label
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#24402C",
                letterSpacing: "0.04em",
                display: "block",
                marginBottom: 12,
              }}
            >
              Radius: {radius} km
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#F0A63A",
                marginBottom: 24,
              }}
            />

            <button
              onClick={() => setShowFilter(false)}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 12,
                background: "#24402C",
                color: "#EFF2E9",
                fontFamily: "'Public Sans', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
              }}
            >
              Apply filter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const [notes, setNotes] = useState(NOTIFICATIONS)

  const dismiss = (id: string) => setNotes(notes.filter((n) => n.id !== id))
  const markRead = (id: string) =>
    setNotes(notes.map((n) => (n.id === id ? { ...n, read: true } : n)))

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#EFF2E9" }}>
      <div style={{ padding: "56px 24px 40px" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginRight: 12,
              padding: 0,
            }}
          >
            <ChevronLeft color="#24402C" />
          </button>
          <h1
            className="font-display"
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#24402C",
              margin: 0,
            }}
          >
            Notifications
          </h1>
        </div>

        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => markRead(note.id)}
            style={{
              background: note.read ? "#fff" : "#fff",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 10,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              borderLeft: note.read ? "none" : "3px solid #F0A63A",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: note.read ? "transparent" : "#F0A63A",
                flexShrink: 0,
                marginTop: 6,
              }}
            />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "'Public Sans', sans-serif",
                  fontSize: 14,
                  color: "#33312C",
                  margin: "0 0 4px",
                  lineHeight: 1.4,
                  fontWeight: note.read ? 400 : 600,
                }}
              >
                {note.text}
              </p>
              <p
                style={{
                  fontFamily: "'Public Sans', sans-serif",
                  fontSize: 12,
                  color: "#9b9690",
                  margin: 0,
                }}
              >
                {note.time}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                dismiss(note.id)
              }}
              style={{
                background: "none",
                border: "none",
                color: "#C9D2BC",
                cursor: "pointer",
                fontSize: 18,
                padding: 0,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}

        {notes.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#7A5568",
              fontFamily: "'Public Sans', sans-serif",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
            <p>All caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────

type Tab = "home" | "search" | "requests" | "profile"

function TabBar({
  active,
  onChange,
  onPost,
  notifCount,
}: {
  active: Tab
  onChange: (t: Tab) => void
  onPost: () => void
  notifCount: number
}) {
  const tabs: { key: Tab label: string icon: React.ReactNode }[] = [
    {
      key: "home",
      label: "Home",
      icon: <HomeIcon active={active === "home"} />,
    },
    {
      key: "search",
      label: "Search",
      icon: <SearchTabIcon active={active === "search"} />,
    },
    {
      key: "requests",
      label: "Requests",
      icon: (
        <RequestsIcon active={active === "requests"} notifCount={notifCount} />
      ),
    },
    {
      key: "profile",
      label: "Profile",
      icon: <ProfileIcon active={active === "profile"} />,
    },
  ]

  return (
    <div
      style={{
        height: 72,
        background: "#fff",
        borderTop: "1px solid #C9D2BC",
        display: "flex",
        alignItems: "center",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Left 2 tabs */}
      <div style={{ flex: 1, display: "flex" }}>
        {tabs.slice(0, 2).map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {tab.icon}
            <span
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: active === tab.key ? "#24402C" : "#9b9690",
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Center FAB */}
      <div
        style={{
          width: 80,
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <button
          onClick={onPost}
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "#F0A63A",
            border: "4px solid #fff",
            boxShadow: "0 4px 16px rgba(240,166,58,0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: -20,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="#24402C"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Right 2 tabs */}
      <div style={{ flex: 1, display: "flex" }}>
        {tabs.slice(2).map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {tab.icon}
            <span
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: active === tab.key ? "#24402C" : "#9b9690",
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12L12 3l9 9"
        stroke={active ? "#24402C" : "#9b9690"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"
        stroke={active ? "#24402C" : "#9b9690"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchTabIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke={active ? "#24402C" : "#9b9690"}
        strokeWidth="1.8"
      />
      <path
        d="M20 20l-3-3"
        stroke={active ? "#24402C" : "#9b9690"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function RequestsIcon({
  active,
  notifCount,
}: {
  active: boolean
  notifCount: number
}) {
  return (
    <div style={{ position: "relative" }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke={active ? "#24402C" : "#9b9690"}
          strokeWidth="1.8"
        />
        <path
          d="M3 9l9 6 9-6"
          stroke={active ? "#24402C" : "#9b9690"}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {notifCount > 0 && (
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#F0A63A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 700,
            fontFamily: "'Public Sans', sans-serif",
            color: "#24402C",
          }}
        >
          {notifCount}
        </div>
      )}
    </div>
  )
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke={active ? "#24402C" : "#9b9690"}
        strokeWidth="1.8"
      />
      <path
        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke={active ? "#24402C" : "#9b9690"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronLeft({ color = "#24402C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#9b9690" strokeWidth="2" />
      <path
        d="M20 20l-3-3"
        stroke="#9b9690"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#7A5568"
      />
      <circle cx="12" cy="9" r="2.5" fill="#EFF2E9" />
    </svg>
  )
}

function QuantityIcon() {
  return <span style={{ fontSize: 12 }}>📦</span>
}

function ClockIcon() {
  return <span style={{ fontSize: 12 }}>⏰</span>
}

// ─── App Shell ───────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("onboarding")
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [selectedPost, setSelectedPost] = useState<FoodPost | null>(null)
  const [pendingRequests] = useState(2)

  const tabScreenMap: Record<Tab, Screen> = {
    home: "home",
    search: "search",
    requests: "requests",
    profile: "profile",
  }

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setScreen(tabScreenMap[tab])
    setSelectedPost(null)
  }, [])

  const handleOpenPost = (post: FoodPost) => {
    setSelectedPost(post)
    setScreen("detail")
  }

  const isInApp = !["onboarding", "login", "signup"].includes(screen)
  const showTabBar =
    isInApp &&
    screen !== "detail" &&
    screen !== "post" &&
    screen !== "myposts" &&
    screen !== "notifications"

  const renderScreen = () => {
    switch (screen) {
      case "onboarding":
        return <OnboardingScreen onDone={() => setScreen("login")} />
      case "login":
        return (
          <LoginScreen
            onLogin={() => {
              setScreen("home")
              setActiveTab("home")
            }}
            onSignup={() => setScreen("signup")}
          />
        )
      case "signup":
        return (
          <SignupScreen
            onDone={() => {
              setScreen("home")
              setActiveTab("home")
            }}
            onBack={() => setScreen("login")}
          />
        )
      case "home":
        return (
          <HomeFeed
            onOpenPost={handleOpenPost}
            onSearch={() => handleTabChange("search")}
          />
        )
      case "detail":
        return (
          <FoodDetail
            post={selectedPost!}
            onBack={() => {
              setScreen("home")
              setSelectedPost(null)
            }}
            onRequest={() => {}}
          />
        )
      case "post":
        return (
          <PostFood
            onBack={() => {
              setScreen("home")
              setActiveTab("home")
            }}
            onPost={() => {
              setScreen("home")
              setActiveTab("home")
            }}
          />
        )
      case "myposts":
        return (
          <MyPosts
            onBack={() => {
              setScreen("profile")
              setActiveTab("profile")
            }}
          />
        )
      case "requests":
        return <RequestsScreen onBack={() => handleTabChange("home")} />
      case "profile":
        return (
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div style={{ flex: 1, overflowY: "auto" }}>
              <ProfileScreen />
            </div>
            <div style={{ padding: "0 24px 12px", background: "#EFF2E9" }}>
              <button
                onClick={() => setScreen("myposts")}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 10,
                  border: "1.5px solid #24402C",
                  background: "transparent",
                  color: "#24402C",
                  fontFamily: "'Public Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                My posts
              </button>
            </div>
          </div>
        )
      case "search":
        return <SearchScreen />
      case "notifications":
        return <NotificationsScreen onBack={() => handleTabChange("home")} />
      default:
        return null
    }
  }

  return (
    <div
      style={{
        width: 390,
        height: 844,
        background: "#EFF2E9",
        borderRadius: 44,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.5), 0 0 0 10px #1a1a1a, inset 0 0 0 1px #333",
        position: "relative",
      }}
    >
      {/* Status bar */}
      {isInApp && (
        <div
          style={{
            height: 44,
            background:
              screen === "home" ||
              screen === "search" ||
              screen === "profile" ||
              screen === "requests"
                ? "#EFF2E9"
                : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            flexShrink: 0,
            position: screen === "detail" ? "absolute" : "relative",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#33312C",
            }}
          >
            9:41
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12 }}>●●●</span>
            <span style={{ fontSize: 12 }}>WiFi</span>
            <span style={{ fontSize: 12 }}>🔋</span>
          </div>
        </div>
      )}

      {/* Notification bell when in app */}
      {isInApp && showTabBar && (
        <button
          onClick={() => setScreen("notifications")}
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 20,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 22,
          }}
        ></button>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderScreen()}
      </div>

      {/* Tab bar */}
      {showTabBar && (
        <TabBar
          active={activeTab}
          onChange={handleTabChange}
          onPost={() => setScreen("post")}
          notifCount={pendingRequests}
        />
      )}
    </div>
  )
}
