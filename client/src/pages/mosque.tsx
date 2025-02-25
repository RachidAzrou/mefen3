import { Edit } from "lucide-react";
import { PiMosqueLight } from "react-icons/pi";
import { FaMale, FaFemale, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRole } from "@/hooks/use-role";

export default function Mosque() {
  const [isEditing, setIsEditing] = useState(false);
  const { isAdmin } = useRole();
  const [mosqueInfo, setMosqueInfo] = useState({
    menAddress: "Sint-Bernardsesteenweg 289",
    menCity: "2660 Hoboken",
    womenAddress: "Polostraat 59",
    womenCity: "2660 Hoboken",
    phone: "032940611",
    email: "info@mefen.be"
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Succes",
      description: "Moskee informatie is bijgewerkt",
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <PiMosqueLight className="h-10 w-10 text-[#963E56]" />
          <h1 className="text-3xl font-bold text-[#963E56]">Mijn Moskee</h1>
        </div>

        {isAdmin && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-[#963E56] text-[#963E56] hover:bg-[#963E56]/10">
                <Edit className="h-4 w-4" />
                Bewerken
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-[#963E56] flex items-center gap-2">
                  <PiMosqueLight className="h-6 w-6" />
                  Moskee Informatie Bewerken
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <FaMale className="h-4 w-4 text-[#963E56]" />
                      Ingang Heren
                    </h3>
                    <Input 
                      value={mosqueInfo.menAddress}
                      onChange={(e) => setMosqueInfo({...mosqueInfo, menAddress: e.target.value})}
                      placeholder="Adres"
                      className="mb-2"
                    />
                    <Input 
                      value={mosqueInfo.menCity}
                      onChange={(e) => setMosqueInfo({...mosqueInfo, menCity: e.target.value})}
                      placeholder="Postcode en Stad"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <FaFemale className="h-4 w-4 text-[#963E56]" />
                      Ingang Dames
                    </h3>
                    <Input 
                      value={mosqueInfo.womenAddress}
                      onChange={(e) => setMosqueInfo({...mosqueInfo, womenAddress: e.target.value})}
                      placeholder="Adres"
                      className="mb-2"
                    />
                    <Input 
                      value={mosqueInfo.womenCity}
                      onChange={(e) => setMosqueInfo({...mosqueInfo, womenCity: e.target.value})}
                      placeholder="Postcode en Stad"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <FaPhone className="h-4 w-4 text-[#963E56]" />
                      Contact Informatie
                    </h3>
                    <Input 
                      value={mosqueInfo.phone}
                      onChange={(e) => setMosqueInfo({...mosqueInfo, phone: e.target.value})}
                      placeholder="Telefoonnummer"
                      className="mb-2"
                    />
                    <Input 
                      value={mosqueInfo.email}
                      onChange={(e) => setMosqueInfo({...mosqueInfo, email: e.target.value})}
                      placeholder="Email"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSave} 
                  className="w-full bg-[#963E56] hover:bg-[#963E56]/90"
                >
                  Opslaan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Details */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white/50 backdrop-blur-sm border-[#963E56]/10">
          <CardHeader className="border-b border-[#963E56]/10 bg-[#963E56]/5">
            <CardTitle className="flex items-center gap-2 text-[#963E56]">
              <PiMosqueLight className="h-5 w-5" />
              Adressen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <FaMale className="h-5 w-5 text-[#963E56]" />
                Ingang Heren
              </h3>
              <p className="text-gray-600 mt-2 pl-7">{mosqueInfo.menAddress}</p>
              <p className="text-gray-600 pl-7">{mosqueInfo.menCity}</p>
            </div>
            <Separator className="bg-[#963E56]/10" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <FaFemale className="h-5 w-5 text-[#963E56]" />
                Ingang Dames
              </h3>
              <p className="text-gray-600 mt-2 pl-7">{mosqueInfo.womenAddress}</p>
              <p className="text-gray-600 pl-7">{mosqueInfo.womenCity}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white/50 backdrop-blur-sm border-[#963E56]/10">
          <CardHeader className="border-b border-[#963E56]/10 bg-[#963E56]/5">
            <CardTitle className="flex items-center gap-2 text-[#963E56]">
              <FaPhone className="h-5 w-5" />
              Contact Informatie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <FaPhone className="h-5 w-5 text-[#963E56]" />
                Telefoonnummer
              </h3>
              <p className="text-gray-600 mt-2 pl-7">{mosqueInfo.phone}</p>
            </div>
            <Separator className="bg-[#963E56]/10" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <FaEnvelope className="h-5 w-5 text-[#963E56]" />
                Email
              </h3>
              <p className="text-gray-600 mt-2 pl-7">{mosqueInfo.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}