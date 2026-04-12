// ─── Persistent Mock Data Store ───
// Uses localStorage so data persists across page refreshes

const STORAGE_KEY = 'qr_platform_data'

function getDefaultData() {
  return {
    events: [
      {
        id: 'evt-001',
        title: 'International Conference on AI in Education',
        type: 'Conference',
        description: 'A comprehensive conference exploring the intersection of artificial intelligence and educational methodologies, featuring keynote speakers from leading universities worldwide. Topics include machine learning in adaptive learning systems, natural language processing for educational content, and ethical considerations in AI-driven education.',
        venue: 'Main Auditorium, College of Computing',
        date: '2025-03-15',
        startTime: '08:00',
        endTime: '17:00',
        organizer: 'Dr. Maria Santos',
        department: 'College of Computing',
        capacity: 150,
        status: 'active',
        feedbackEnabled: true,
        createdAt: '2025-02-01T08:00:00',
      },
      {
        id: 'evt-002',
        title: 'Research Methods Workshop for Graduate Students',
        type: 'Seminar',
        description: 'An intensive workshop on quantitative and qualitative research methodologies designed for graduate students preparing their thesis proposals. Covers experimental design, statistical analysis, survey instruments, and academic writing best practices.',
        venue: 'Room 301, Graduate School Building',
        date: '2025-04-20',
        startTime: '09:00',
        endTime: '16:00',
        organizer: 'Prof. James Cruz',
        department: 'Graduate School',
        capacity: 80,
        status: 'active',
        feedbackEnabled: true,
        createdAt: '2025-03-01T10:00:00',
      },
      {
        id: 'evt-003',
        title: 'Cybersecurity Awareness Seminar',
        type: 'Seminar',
        description: 'An educational seminar on current cybersecurity threats, best practices for data protection, and institutional security policies for faculty and staff members. Includes hands-on demonstrations of common attack vectors and defense strategies.',
        venue: 'ICT Training Center',
        date: '2025-05-10',
        startTime: '13:00',
        endTime: '17:00',
        organizer: 'Engr. Ana Reyes',
        department: 'IT Department',
        capacity: 100,
        status: 'upcoming',
        feedbackEnabled: true,
        createdAt: '2025-03-15T14:00:00',
      },
    ],
    registrations: [
      { id: 'reg-001', eventId: 'evt-001', name: 'Juan Dela Cruz', email: 'juan.delacruz@university.edu.ph', phone: '+63 912 345 6789', affiliation: 'College of Engineering', type: 'Student', qrCode: 'QR-E001-P001-2025', registeredAt: '2025-03-01T08:30:00', attended: true, checkInTime: '2025-03-15T07:45:00', feedbackSubmitted: false },
      { id: 'reg-002', eventId: 'evt-001', name: 'Maria Garcia', email: 'maria.garcia@university.edu.ph', phone: '+63 917 654 3210', affiliation: 'College of Science', type: 'Faculty', qrCode: 'QR-E001-P002-2025', registeredAt: '2025-03-02T10:15:00', attended: true, checkInTime: '2025-03-15T07:52:00', feedbackSubmitted: true },
      { id: 'reg-003', eventId: 'evt-001', name: 'Carlos Reyes', email: 'carlos.reyes@external.org', phone: '+63 918 111 2222', affiliation: 'National Research Council', type: 'Researcher', qrCode: 'QR-E001-P003-2025', registeredAt: '2025-03-03T14:20:00', attended: true, checkInTime: '2025-03-15T08:01:00', feedbackSubmitted: false },
      { id: 'reg-004', eventId: 'evt-001', name: 'Diana Villanueva', email: 'diana.v@company.com', phone: '+63 921 777 8888', affiliation: 'TechCorp Solutions', type: 'Professional', qrCode: 'QR-E001-P004-2025', registeredAt: '2025-03-05T16:45:00', attended: false, checkInTime: null, feedbackSubmitted: false },
      { id: 'reg-005', eventId: 'evt-002', name: 'Angela Torres', email: 'angela.torres@university.edu.ph', phone: '+63 919 333 4444', affiliation: 'College of Computing', type: 'Student', qrCode: 'QR-E002-P001-2025', registeredAt: '2025-04-05T09:00:00', attended: true, checkInTime: '2025-04-20T08:55:00', feedbackSubmitted: true },
      { id: 'reg-006', eventId: 'evt-002', name: 'Roberto Santos', email: 'roberto.santos@university.edu.ph', phone: '+63 920 555 6666', affiliation: 'Graduate School', type: 'Student', qrCode: 'QR-E002-P002-2025', registeredAt: '2025-04-06T11:30:00', attended: false, checkInTime: null, feedbackSubmitted: false },
      { id: 'reg-007', eventId: 'evt-002', name: 'Mark Lim', email: 'mark.lim@university.edu.ph', phone: '+63 922 999 0000', affiliation: 'College of Business', type: 'Faculty', qrCode: 'QR-E002-P003-2025', registeredAt: '2025-04-08T13:00:00', attended: true, checkInTime: '2025-04-20T09:02:00', feedbackSubmitted: false },
    ],
    feedback: [
      { id: 'fb-001', registrationId: 'reg-002', eventId: 'evt-001', q1: 5, q2: 5, q3: 4, q4: 5, q5: 5, comment: 'Excellent event organization. The QR check-in was seamless and very efficient.', submittedAt: '2025-03-15T16:45:00' },
      { id: 'fb-002', registrationId: 'reg-005', eventId: 'evt-002', q1: 4, q2: 5, q3: 5, q4: 4, q5: 4, comment: 'The workshop was very informative. Easy check-in process.', submittedAt: '2025-04-20T15:30:00' },
    ],
    organizers: [
      { id: 'org-001', name: 'Admin User', email: 'admin@university.edu.ph', password: 'admin123', institution: 'College of Computing', verified: true },
    ],
  }
}

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.warn('Failed to load data from localStorage:', e)
  }
  return getDefaultData()
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save data to localStorage:', e)
  }
}

// ─── Store API ───
class DataStore {
  constructor() {
    this.data = loadData()
    this.listeners = new Set()
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    saveData(this.data)
    this.listeners.forEach(l => l(this.data))
  }

  // Events
  getEvents() { return this.data.events }
  getEvent(id) { return this.data.events.find(e => e.id === id) }
  
  addEvent(event) {
    const id = `evt-${String(this.data.events.length + 1).padStart(3, '0')}`
    const newEvent = { ...event, id, createdAt: new Date().toISOString() }
    this.data.events.push(newEvent)
    this.notify()
    return newEvent
  }

  updateEvent(id, updates) {
    const idx = this.data.events.findIndex(e => e.id === id)
    if (idx !== -1) {
      this.data.events[idx] = { ...this.data.events[idx], ...updates }
      this.notify()
    }
  }

  deleteEvent(id) {
    this.data.events = this.data.events.filter(e => e.id !== id)
    this.data.registrations = this.data.registrations.filter(r => r.eventId !== id)
    this.data.feedback = this.data.feedback.filter(f => f.eventId !== id)
    this.notify()
  }

  // Registrations
  getRegistrations(eventId) {
    if (eventId) return this.data.registrations.filter(r => r.eventId === eventId)
    return this.data.registrations
  }

  getRegistration(id) { return this.data.registrations.find(r => r.id === id) }
  
  getRegistrationByQR(qrCode) { return this.data.registrations.find(r => r.qrCode === qrCode) }
  
  getRegistrationByEmail(email, eventId) {
    return this.data.registrations.find(r => r.email === email && r.eventId === eventId)
  }

  addRegistration(reg) {
    const eventRegs = this.getRegistrations(reg.eventId)
    const idx = eventRegs.length + 1
    const eventNum = reg.eventId.replace('evt-', '')
    const qrCode = `QR-E${eventNum}-P${String(idx).padStart(3, '0')}-${new Date().getFullYear()}`
    const id = `reg-${String(this.data.registrations.length + 1).padStart(3, '0')}`
    const newReg = {
      ...reg, id, qrCode,
      registeredAt: new Date().toISOString(),
      attended: false, checkInTime: null, feedbackSubmitted: false,
    }
    this.data.registrations.push(newReg)
    this.notify()
    return newReg
  }

  // Attendance
  markAttendance(qrCode) {
    const reg = this.getRegistrationByQR(qrCode)
    if (!reg) return { success: false, type: 'not_found', message: 'No registration found for this QR code.' }
    if (reg.attended) return { success: false, type: 'duplicate', message: 'This participant has already been checked in.', registration: reg }
    
    const idx = this.data.registrations.findIndex(r => r.id === reg.id)
    this.data.registrations[idx] = { ...reg, attended: true, checkInTime: new Date().toISOString() }
    this.notify()
    return { success: true, type: 'success', message: 'Attendance confirmed!', registration: this.data.registrations[idx] }
  }

  // Feedback
  getFeedback(eventId) {
    if (eventId) return this.data.feedback.filter(f => f.eventId === eventId)
    return this.data.feedback
  }

  addFeedback(fb) {
    const id = `fb-${String(this.data.feedback.length + 1).padStart(3, '0')}`
    const newFb = { ...fb, id, submittedAt: new Date().toISOString() }
    this.data.feedback.push(newFb)
    
    // Mark registration as feedback submitted
    const regIdx = this.data.registrations.findIndex(r => r.id === fb.registrationId)
    if (regIdx !== -1) this.data.registrations[regIdx].feedbackSubmitted = true
    
    this.notify()
    return newFb
  }

  // Auth
  authenticateOrganizer(email, password) {
    return this.data.organizers.find(o => o.email === email && o.password === password)
  }

  registerOrganizer(org) {
    if (this.data.organizers.find(o => o.email === org.email)) return null
    const id = `org-${String(this.data.organizers.length + 1).padStart(3, '0')}`
    const newOrg = { ...org, id, verified: false }
    this.data.organizers.push(newOrg)
    this.notify()
    return newOrg
  }

  // Analytics
  getAnalytics() {
    const regs = this.data.registrations
    const attended = regs.filter(r => r.attended)
    const feedbacks = this.data.feedback
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + (f.q1 + f.q2 + f.q3 + f.q4 + f.q5) / 5, 0) / feedbacks.length
      : 0

    return {
      totalEvents: this.data.events.length,
      totalRegistrations: regs.length,
      totalAttended: attended.length,
      attendanceRate: regs.length > 0 ? ((attended.length / regs.length) * 100).toFixed(1) : 0,
      totalFeedback: feedbacks.length,
      feedbackRate: attended.length > 0 ? ((feedbacks.length / attended.length) * 100).toFixed(1) : 0,
      avgSatisfaction: avgRating.toFixed(2),
    }
  }

  // Reset
  resetData() {
    this.data = getDefaultData()
    this.notify()
  }
}

export const store = new DataStore()
