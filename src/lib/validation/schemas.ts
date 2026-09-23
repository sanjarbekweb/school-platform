export interface ValidationError {
  field: string
  message: string
}

export function validateNews(data: any): ValidationError[] {
  const errors: ValidationError[] = []
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Sarlavha kamida 3 ta belgidan iborat bo‘lishi shart.' })
  }
  if (!data.summary || typeof data.summary !== 'string' || data.summary.trim().length < 5) {
    errors.push({ field: 'summary', message: 'Qisqa mazmun (anons) kiritilishi shart.' })
  }
  if (!data.category) {
    errors.push({ field: 'category', message: 'Kategoriya (rukn) tanlanishi shart.' })
  }
  return errors
}

export function validateNotice(data: any): ValidationError[] {
  const errors: ValidationError[] = []
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'E’lon sarlavhasi kiritilishi shart.' })
  }
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length < 5) {
    errors.push({ field: 'content', message: 'E’lon matni kiritilishi shart.' })
  }
  if (data.startDate && data.expiryDate) {
    const start = new Date(data.startDate).getTime()
    const expiry = new Date(data.expiryDate).getTime()
    if (expiry <= start) {
      errors.push({ field: 'expiryDate', message: 'Tugash muddati boshlanish sanasidan keyin bo‘lishi shart.' })
    }
  }
  return errors
}

export function validateStaff(data: any): ValidationError[] {
  const errors: ValidationError[] = []
  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 3) {
    errors.push({ field: 'fullName', message: 'Xodimning to‘liq ismi (F.I.O.) kiritilishi shart.' })
  }
  if (!data.role) {
    errors.push({ field: 'role', message: 'Lavozim tanlanishi shart.' })
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Haqiqiy elektron pochta manzili kiritilishi shart.' })
  }
  return errors
}

export function validateRedirect(data: any): ValidationError[] {
  const errors: ValidationError[] = []
  if (!data.from || typeof data.from !== 'string' || !data.from.startsWith('/')) {
    errors.push({ field: 'from', message: 'Eski havola "/" belgisi bilan boshlanishi shart (masalan: /eski-sahifa).' })
  }
  if (!data.to || typeof data.to !== 'string' || !data.to.startsWith('/')) {
    errors.push({ field: 'to', message: 'Yangi havola "/" belgisi bilan boshlanishi shart (masalan: /yangi-sahifa).' })
  }
  if (data.from && data.to && data.from.trim() === data.to.trim()) {
    errors.push({ field: 'to', message: 'Qayta yo‘naltirish manzili boshlang‘ich manzil bilan bir xil bo‘lishi mumkin emas (cheksiz halqa xavfi).' })
  }
  return errors
}

export function validateUser(data: any, isNew = false): ValidationError[] {
  const errors: ValidationError[] = []
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Foydalanuvchi ismi kiritilishi shart.' })
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'To‘g‘ri elektron pochta manzili kiritilishi shart.' })
  }
  if (isNew && (!data.password || data.password.length < 8)) {
    errors.push({ field: 'password', message: 'Parol kamida 8 ta belgidan iborat bo‘lishi shart.' })
  }
  return errors
}

export function validateSiteSettings(data: any): ValidationError[] {
  const errors: ValidationError[] = []
  if (!data.schoolName || data.schoolName.trim().length < 3) {
    errors.push({ field: 'schoolName', message: 'Maktab nomi kiritilishi shart.' })
  }
  if (!data.phone || data.phone.trim().length < 7) {
    errors.push({ field: 'phone', message: 'Rasmiy telefon raqami kiritilishi shart.' })
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'To‘g‘ri elektron pochta manzili kiritilishi shart.' })
  }
  return errors
}
