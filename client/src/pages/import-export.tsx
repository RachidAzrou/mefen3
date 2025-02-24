import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, FileCheck, Users, X } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15,
  },
  logo: {
    width: 80,
    marginRight: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: '#963E56',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
  },
  table: {
    width: '100%',
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    minHeight: 35,
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    color: '#374151',
  },
  tableCellHeader: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 8,
    borderTop: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
});

type Volunteer = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
};

const VolunteersPDF = ({ volunteers }: { volunteers: Volunteer[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image
          src={`${window.location.origin}/static/Naamloos.png`}
          style={styles.logo}
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>MEFEN Vrijwilligersoverzicht</Text>
          <Text style={styles.subtitle}>
            Bijgewerkt op {format(new Date(), 'd MMMM yyyy', { locale: nl })}
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCellHeader}>Voornaam</Text>
          <Text style={styles.tableCellHeader}>Achternaam</Text>
          <Text style={styles.tableCellHeader}>Telefoonnummer</Text>
          <Text style={styles.tableCellHeader}>E-mail</Text>
        </View>

        {volunteers.map((volunteer, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{volunteer.firstName}</Text>
            <Text style={styles.tableCell}>{volunteer.lastName}</Text>
            <Text style={styles.tableCell}>{volunteer.phoneNumber}</Text>
            <Text style={styles.tableCell}>{volunteer.email || '-'}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        MEFEN Vrijwilligers Management Systeem • Totaal aantal vrijwilligers: {volunteers.length}
      </Text>
    </Page>
  </Document>
);

export default function ImportExport() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Haal alle actieve vrijwilligers op uit de database
    const volunteersRef = ref(db, "volunteers");
    const unsubscribe = onValue(volunteersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const volunteersList = Object.entries(data).map(([id, volunteer]: [string, any]) => ({
          id,
          ...volunteer
        }));
        setVolunteers(volunteersList);
      } else {
        setVolunteers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-8 w-8 text-[#963E56]" />
        <h1 className="text-3xl font-bold text-[#963E56]">Vrijwilligers Export</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader className="border-b bg-gray-50/80">
          <CardTitle className="flex items-center gap-2 text-[#963E56]">
            <Download className="h-5 w-5" />
            Exporteer Vrijwilligerslijst
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="rounded-lg border p-6 bg-gray-50/30">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    Vrijwilligersoverzicht
                  </h3>
                  <p className="text-sm text-gray-500">
                    Download een volledig overzicht van alle actieve vrijwilligers
                  </p>
                </div>
                <PDFDownloadLink
                  document={<VolunteersPDF volunteers={volunteers} />}
                  fileName={`vrijwilligers-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
                >
                  {({ loading }) => (
                    <Button className="bg-[#963E56] hover:bg-[#963E56]/90 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? "PDF wordt gemaakt..." : "Download PDF"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}