import { jsPDF } from 'jspdf'

import { NotaRow } from '../business/MisNotasBusiness'

interface GenerarReportePDFParams {
  rows: NotaRow[]
  promedioPonderado: number | null
  studentName: string
}

const PAGE_MARGIN = 14
const LINE_HEIGHT = 6

function formatDate(value: Date): string {
  return value.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function sanitizeFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'estudiante'
}

function ensureSpace(doc: jsPDF, y: number, requiredHeight: number): number {
  const pageHeight = doc.internal.pageSize.getHeight()

  if (y + requiredHeight <= pageHeight - PAGE_MARGIN) {
    return y
  }

  doc.addPage()
  return PAGE_MARGIN
}

function writeHeading(doc: jsPDF, title: string, y: number): number {
  y = ensureSpace(doc, y, 14)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text(title, PAGE_MARGIN, y)
  return y + 8
}

function writeLabelValue(doc: jsPDF, label: string, value: string, y: number): number {
  const contentWidth = doc.internal.pageSize.getWidth() - PAGE_MARGIN * 2
  const lines = doc.splitTextToSize(value, contentWidth)
  const blockHeight = LINE_HEIGHT * (lines.length + 1)

  y = ensureSpace(doc, y, blockHeight)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  doc.text(label, PAGE_MARGIN, y)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(15, 23, 42)
  doc.text(lines, PAGE_MARGIN, y + LINE_HEIGHT)

  return y + blockHeight + 1
}

function writeSectionSeparator(doc: jsPDF, y: number): number {
  y = ensureSpace(doc, y, 4)
  doc.setDrawColor(226, 232, 240)
  doc.line(PAGE_MARGIN, y, doc.internal.pageSize.getWidth() - PAGE_MARGIN, y)
  return y + 5
}

export function generarReportePDF({ rows, promedioPonderado, studentName }: GenerarReportePDFParams): void {
  const doc = new jsPDF()
  const now = new Date()
  const sanitizedName = sanitizeFileName(studentName)
  let y = PAGE_MARGIN

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(15, 23, 42)
  doc.text('Reporte de desempeño', PAGE_MARGIN, y)

  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  doc.text(`Estudiante: ${studentName}`, PAGE_MARGIN, y)
  y += 5
  doc.text(`Fecha de generación: ${formatDate(now)}`, PAGE_MARGIN, y)

  y += 8
  y = writeSectionSeparator(doc, y)
  y = writeHeading(doc, 'Resumen', y)
  y = writeLabelValue(doc, 'Promedio ponderado general', promedioPonderado === null ? 'Pendiente' : promedioPonderado.toFixed(1), y)

  rows.forEach((row, index) => {
    y = writeSectionSeparator(doc, y)
    y = writeHeading(doc, `Evaluación ${index + 1}`, y)
    y = writeLabelValue(doc, 'Nombre', row.evaluationName, y)
    y = writeLabelValue(doc, 'Asignatura', row.subjectName, y)
    y = writeLabelValue(doc, 'Grupo', row.groupName, y)
    y = writeLabelValue(doc, 'Peso', `${row.weight}%`, y)
    y = writeLabelValue(doc, 'Nota final', row.finalScore === null ? 'Pendiente' : row.finalScore.toFixed(1), y)

    y = ensureSpace(doc, y, 14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    doc.text('Desglose por criterio', PAGE_MARGIN, y)
    y += 7

    if (row.details.length === 0) {
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(107, 114, 128)
      doc.text('No hay desglose por criterio disponible.', PAGE_MARGIN, y)
      y += LINE_HEIGHT
    } else {
      row.details.forEach((detail) => {
        const commentText = detail.comment?.trim() ? detail.comment : '—'
        const lines = doc.splitTextToSize(commentText, 70)
        const blockHeight = Math.max(LINE_HEIGHT * (lines.length + 1), 12)

        y = ensureSpace(doc, y, blockHeight)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(15, 23, 42)
        doc.text(detail.criterionName, PAGE_MARGIN, y)

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(71, 85, 105)
        doc.text(`Nivel: ${detail.levelName}`, PAGE_MARGIN + 72, y)
        doc.text(`Puntaje: ${detail.score}`, PAGE_MARGIN + 140, y)

        doc.setTextColor(107, 114, 128)
        doc.text(`Comentario:`, PAGE_MARGIN, y + LINE_HEIGHT)
        doc.text(lines, PAGE_MARGIN + 18, y + LINE_HEIGHT)

        y += blockHeight + 2
      })
    }

    if (row.observations.trim()) {
      y = ensureSpace(doc, y, 20)
      doc.setFillColor(236, 253, 245)
      doc.setDrawColor(167, 243, 208)
      doc.roundedRect(PAGE_MARGIN, y, doc.internal.pageSize.getWidth() - PAGE_MARGIN * 2, 18, 2, 2, 'FD')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(4, 120, 87)
      doc.text('Observación general', PAGE_MARGIN + 3, y + 6)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(6, 95, 70)
      const observationLines = doc.splitTextToSize(row.observations, doc.internal.pageSize.getWidth() - PAGE_MARGIN * 2 - 6)
      doc.text(observationLines, PAGE_MARGIN + 3, y + 12)
      y += 22
    }
  })

  doc.save(`reporte-notas-${sanitizedName}.pdf`)
}