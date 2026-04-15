"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 32, fontFamily: "Pretendard" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#888", marginBottom: 20 },
  table: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 4 },
  header: { flexDirection: "row", backgroundColor: "#f5f5f5", borderBottomWidth: 1, borderColor: "#e5e5e5" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#e5e5e5" },
  lastRow: { flexDirection: "row" },
  cell: { flex: 1, padding: 8, fontSize: 9 },
  headerCell: { flex: 1, padding: 8, fontSize: 9, fontWeight: "bold", color: "#555" },
});

interface MemberExportData {
  nickname: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface MemberPdfDocumentProps {
  spaceName: string;
  members: MemberExportData[];
  exportedAt: string;
}

export function MemberPdfDocument({ spaceName, members, exportedAt }: MemberPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{spaceName} 멤버 목록</Text>
        <Text style={styles.subtitle}>
          총 {members.length}명 · {exportedAt} 기준
        </Text>
        <View style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.headerCell}>이름</Text>
            <Text style={styles.headerCell}>이메일</Text>
            <Text style={styles.headerCell}>역할</Text>
            <Text style={styles.headerCell}>가입일</Text>
          </View>
          {members.map((m, i) => (
            <View key={m.email} style={i === members.length - 1 ? styles.lastRow : styles.row}>
              <Text style={styles.cell}>{m.nickname}</Text>
              <Text style={styles.cell}>{m.email}</Text>
              <Text style={styles.cell}>{m.role}</Text>
              <Text style={styles.cell}>{m.joinedAt}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
