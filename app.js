const INITIAL_REQUESTS = [];

function getStoredRequests() {
  const data = localStorage.getItem("campus_tutor_requests");
  if (!data) {
    localStorage.setItem("campus_tutor_requests", JSON.stringify(INITIAL_REQUESTS));
    return INITIAL_REQUESTS;
  }
  try {
    const parsed = JSON.parse(data);
    return parsed.map(r => {
      if (r.budget && r.budget.includes('$')) {
        r.budget = r.budget.replace('$', '₹');
      }
      return r;
    });
  } catch (e) {
    return INITIAL_REQUESTS;
  }
}

function saveRequest(newReq) {
  const current = getStoredRequests();
  current.unshift(newReq);
  localStorage.setItem("campus_tutor_requests", JSON.stringify(current));
  return newReq;
}

function showToast(message, icon = "✓") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span style="color: #e2a03f; font-weight: bold; font-size: 16px;">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function getInitials(name) {
  if (!name) return "CT";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function getCurrentUser() {
  const userStr = localStorage.getItem("campus_tutor_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

function logoutUser(e) {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  if (window.CampusBackend && typeof window.CampusBackend.signOut === "function") {
    window.CampusBackend.signOut();
  }
  localStorage.removeItem("campus_tutor_user");
  showToast("You have been signed out.", "👋");
  
  // Re-render auth nav state across all headers
  initAuthNav();

  // If on profile page, redirect to login
  if (window.location.pathname.endsWith("profile.html") || window.location.pathname.endsWith("admin.html")) {
    setTimeout(() => {
      window.location.href = "login.html";
    }, 600);
  } else if (window.location.pathname.endsWith("login.html")) {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}

const INITIAL_MEMBERS = [
  {
    id: "MEM-101",
    name: "Aditya Sarudkar",
    email: "aditya.s@campus.edu",
    studentId: "STU-8821",
    role: "tutor",
    roleLabel: "Verified Peer Tutor",
    department: "Computer Science & Engineering",
    year: "Junior (3rd Year)",
    avatar: "AS",
    status: "active",
    rating: 4.9,
    reviewsCount: 24,
    sessionsCount: 38,
    requestsCount: 2,
    joinDate: "Aug 2025",
    strikes: 0,
    tags: ["Data Structures", "Algorithms", "Python", "C++"],
    bio: "CS Teaching Assistant & passionate peer tutor for core algorithmic concepts and midterm prep."
  },
  {
    id: "MEM-102",
    name: "Priya Sharma",
    email: "psharma@campus.edu",
    studentId: "STU-9042",
    role: "tutor",
    roleLabel: "Verified Peer Tutor",
    department: "Mechanical Engineering",
    year: "Freshman (1st Year)",
    avatar: "PS",
    status: "active",
    rating: 4.8,
    reviewsCount: 18,
    sessionsCount: 29,
    requestsCount: 4,
    joinDate: "Sep 2025",
    tags: ["Calculus II", "Linear Algebra", "Thermodynamics"],
    bio: "Math enthusiast with high score in Multivariable Calculus. Available for evening Zoom sessions."
  },
  {
    id: "MEM-103",
    name: "Jordan Lee",
    email: "jordan.l@campus.edu",
    studentId: "STU-7419",
    role: "student",
    roleLabel: "Active Requester",
    department: "Aerospace Engineering",
    year: "Junior (3rd Year)",
    avatar: "JL",
    status: "active",
    rating: 4.7,
    reviewsCount: 12,
    sessionsCount: 15,
    requestsCount: 8,
    joinDate: "Oct 2025",
    strikes: 0,
    tags: ["Physics 211", "Aerodynamics"],
    bio: "Student searching for specialized assistance in rotational mechanics and flight systems."
  },
  {
    id: "MEM-104",
    name: "Samantha Ray",
    email: "samantha.r@campus.edu",
    studentId: "STU-6581",
    role: "tutor",
    roleLabel: "Senior Peer Tutor",
    department: "Pre-Med & Biochemistry",
    year: "Senior (4th Year)",
    avatar: "SR",
    status: "active",
    rating: 5.0,
    reviewsCount: 42,
    sessionsCount: 65,
    requestsCount: 1,
    joinDate: "Jan 2025",
    strikes: 0,
    tags: ["Organic Chemistry", "Biochemistry", "MCAT Prep"],
    bio: "Pre-med honor society president. Conducted over 60 tutoring sessions with 100% 5-star ratings."
  },
  {
    id: "MEM-105",
    name: "David Kim",
    email: "dkim@campus.edu",
    studentId: "STU-5120",
    role: "student",
    roleLabel: "Flagged Student",
    department: "Economics & Finance",
    year: "Senior (4th Year)",
    avatar: "DK",
    status: "warning",
    rating: 3.8,
    reviewsCount: 6,
    sessionsCount: 9,
    requestsCount: 12,
    joinDate: "Nov 2025",
    strikes: 1,
    tags: ["Macroeconomics", "Financial Econometrics"],
    bio: "Senior in Economics. Currently under review for reported off-platform payment communication."
  },
  {
    id: "MEM-106",
    name: "Elena Rostova",
    email: "elena.r@campus.edu",
    studentId: "STU-4433",
    role: "student",
    roleLabel: "Active Requester",
    department: "Electrical & Computer Eng.",
    year: "Freshman (1st Year)",
    avatar: "ER",
    status: "active",
    rating: 4.9,
    reviewsCount: 8,
    sessionsCount: 11,
    requestsCount: 6,
    joinDate: "Feb 2026",
    strikes: 0,
    tags: ["MATLAB", "Circuit Analysis"],
    bio: "First-year engineering student active in hardware labs and programming study groups."
  },
  {
    id: "MEM-107",
    name: "Marcus Vance",
    email: "m.vance@campus.edu",
    studentId: "STU-3199",
    role: "student",
    roleLabel: "Suspended Account",
    department: "Business Administration",
    year: "Sophomore (2nd Year)",
    avatar: "MV",
    status: "suspended",
    rating: 2.5,
    reviewsCount: 4,
    sessionsCount: 5,
    requestsCount: 7,
    joinDate: "Sep 2025",
    strikes: 3,
    tags: ["Statistics", "Accounting"],
    bio: "Suspended on Feb 12 due to multiple confirmed academic integrity violations."
  },
  {
    id: "MEM-108",
    name: "Dr. Katherine Vance",
    email: "admin@campus.edu",
    studentId: "ADM-8924",
    role: "admin",
    roleLabel: "Senior Administrator",
    department: "Dean of Academic Affairs",
    year: "Faculty Staff",
    avatar: "KV",
    status: "active",
    rating: 5.0,
    reviewsCount: 0,
    sessionsCount: 0,
    requestsCount: 0,
    joinDate: "Aug 2024",
    strikes: 0,
    tags: ["Administration", "Compliance", "Security"],
    bio: "Campus academic moderator & administrator overseer."
  }
];

const INITIAL_REPORTS = [
  {
    id: "REP-2026-081",
    title: "Off-Platform Payment Dispute & Pressure",
    category: "Payment Dispute",
    priority: "High",
    reportedUserId: "MEM-105",
    reportedUserName: "David Kim",
    reportedUserEmail: "dkim@campus.edu",
    reportedUserRole: "Student Requester",
    reporterId: "MEM-102",
    reporterName: "Priya Sharma",
    reporterRole: "Verified Peer Tutor",
    createdAt: "2 hours ago",
    timestamp: Date.now() - 7200000,
    status: "pending",
    description: "Student booked a 2-hour Calculus session listed at ₹400/hr. After the session was completed in library, student insisted on sending ₹500 total via an unverified third-party app instead of the agreed ₹800 platform escrow.",
    evidence: "Chat screenshots showing insistence on unauthorized discounts and refusal to release milestone funds.",
    assignedAdmin: "Dr. Katherine Vance",
    resolutionNote: ""
  },
  {
    id: "REP-2026-079",
    title: "Requesting Direct Exam Solutions During Live Test",
    category: "Academic Integrity",
    priority: "Critical",
    reportedUserId: "MEM-107",
    reportedUserName: "Marcus Vance",
    reportedUserEmail: "m.vance@campus.edu",
    reportedUserRole: "Student Requester",
    reporterId: "MEM-101",
    reporterName: "Aditya Sarudkar",
    reporterRole: "Verified Peer Tutor",
    createdAt: "Yesterday",
    timestamp: Date.now() - 86400000,
    status: "investigating",
    description: "User posted a tutoring request labeled 'Urgent CS Quiz Help' and when connecting on Google Meet, shared an active timed exam screen demanding the tutor write the answers directly in violation of the campus Honor Code.",
    evidence: "Screen recording timestamped at 14:15 during CS201 Midterm window.",
    assignedAdmin: "Dr. Katherine Vance",
    resolutionNote: "User placed on immediate temporary suspension pending Honor Board review."
  },
  {
    id: "REP-2026-075",
    title: "Unannounced No-Show for Booked Lab Session",
    category: "No-Show & Spam",
    priority: "Medium",
    reportedUserId: "MEM-103",
    reportedUserName: "Jordan Lee",
    reportedUserEmail: "jordan.l@campus.edu",
    reportedUserRole: "Student Requester",
    reporterId: "MEM-104",
    reporterName: "Samantha Ray",
    reporterRole: "Senior Peer Tutor",
    createdAt: "2 days ago",
    timestamp: Date.now() - 172800000,
    status: "resolved",
    description: "Tutor reserved Physics Lab study room for 90 minutes. Requester did not show up or provide cancellation notice within the required 3-hour policy window.",
    evidence: "Room booking receipt and unanswered messages at meeting time.",
    assignedAdmin: "Dr. Katherine Vance",
    resolutionNote: "Requester warned and charged 25% cancellation convenience fee refunded to tutor."
  },
  {
    id: "REP-2026-068",
    title: "Spam Posting Duplicate Requests in Engineering Board",
    category: "No-Show & Spam",
    priority: "Low",
    reportedUserId: "MEM-106",
    reportedUserName: "Elena Rostova",
    reportedUserEmail: "elena.r@campus.edu",
    reportedUserRole: "Student Requester",
    reporterId: "SYSTEM",
    reporterName: "Automated Rate Limiter",
    reporterRole: "Bot Guard",
    createdAt: "3 days ago",
    timestamp: Date.now() - 259200000,
    status: "dismissed",
    description: "System flagged 4 identical posts in under 2 minutes. Investigation revealed student encountered intermittent browser WiFi lag causing repeated button submissions.",
    evidence: "Server log network retry headers.",
    assignedAdmin: "Dr. Katherine Vance",
    resolutionNote: "Accidental submission duplicates pruned. No disciplinary strike warranted."
  }
];

function getStoredMembers() {
  const data = localStorage.getItem("campus_tutor_members");
  if (!data) {
    localStorage.setItem("campus_tutor_members", JSON.stringify(INITIAL_MEMBERS));
    return INITIAL_MEMBERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_MEMBERS;
  }
}

function saveMembers(members) {
  localStorage.setItem("campus_tutor_members", JSON.stringify(members));
}

function getStoredReports() {
  const data = localStorage.getItem("campus_tutor_reports");
  if (!data) {
    localStorage.setItem("campus_tutor_reports", JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_REPORTS;
  }
}

function saveReports(reports) {
  localStorage.setItem("campus_tutor_reports", JSON.stringify(reports));
}

function initAuthNav() {
  const user = getCurrentUser();
  const navLoginBtns = document.querySelectorAll(".nav-login-btn");
  const navElements = document.querySelectorAll("header nav");
  
  navElements.forEach(nav => {
    let adminLink = nav.querySelector(".nav-admin-link");
    if (user && user.role === "admin") {
      if (!adminLink) {
        adminLink = document.createElement("a");
        adminLink.href = "admin.html";
        adminLink.className = "nav-admin-link";
        adminLink.innerHTML = `<span style="background: rgba(226, 160, 63, 0.2); color: #e2a03f; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 12.5px; border: 1px solid rgba(226, 160, 63, 0.4); display: inline-flex; align-items: center; gap: 4px;">🛡️ Admin Portal</span>`;
        const lastBtn = nav.querySelector(".nav-login-btn");
        if (lastBtn) {
          nav.insertBefore(adminLink, lastBtn);
        } else {
          nav.appendChild(adminLink);
        }
      }
      if (window.location.pathname.endsWith("admin.html")) {
        adminLink.classList.add("active");
      }
    } else {
      if (adminLink) {
        adminLink.remove();
      }
    }
  });

  if (!navLoginBtns.length) return;

  const isLoginPage = window.location.pathname.endsWith("login.html");

  navLoginBtns.forEach(btn => {
    if (user) {
      btn.innerHTML = `<span style="font-size: 13.5px; font-weight: 700;">🚪 Sign Out</span>`;
      btn.href = "javascript:void(0)";
      btn.onclick = (e) => logoutUser(e);
      btn.classList.add("nav-signout-btn");
      btn.classList.remove("active");
      btn.title = `Signed in as ${user.name} (${user.role}). Click to Sign Out.`;
    } else {
      btn.innerHTML = `<span>Sign In</span>`;
      btn.href = "login.html";
      btn.onclick = null;
      btn.classList.remove("nav-signout-btn");
      if (isLoginPage) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
      btn.title = "Click to Sign In";
    }
  });
}

function initPageTransitions() {
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-fading-out");
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.target === "_blank" ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.defaultPrevented
    ) {
      return;
    }

    const currentPath = (window.location.pathname.split("/").pop() || "index.html").split("?")[0].split("#")[0];
    const targetPath = (href.split("/").pop() || "index.html").split("?")[0].split("#")[0];

    if (currentPath === targetPath) {
      return;
    }

    e.preventDefault();
    document.body.classList.add("page-fading-out");

    setTimeout(() => {
      window.location.href = href;
    }, 260);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAuthNav();
  initPageTransitions();
});