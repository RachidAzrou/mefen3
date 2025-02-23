import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { ref, update, onValue } from "firebase/database";
import { Package } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const equipmentSchema = z.object({
  volunteerId: z.string().min(1, "Volunteer is required"),
  type: z.string().min(1, "Equipment type is required"),
  number: z.number().min(1).max(100),
});

type Equipment = {
  id: string;
  type: string;
  number: number;
  volunteerId?: string;
  isCheckedOut: boolean;
};

type Volunteer = {
  id: string;
  firstName: string;
  lastName: string;
};

const EQUIPMENT_TYPES = [
  { value: "jacket", label: "Jacket", max: 100 },
  { value: "vest", label: "Vest", max: 100 },
  { value: "lamp", label: "Lamp", max: 20 },
  { value: "walkie_talkie", label: "Walkie Talkie", max: 20 },
];

export default function Equipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
  });

  // Load equipment and volunteers from Firebase
  useState(() => {
    const equipmentRef = ref(db, "equipment");
    onValue(equipmentRef, (snapshot) => {
      const data = snapshot.val();
      const equipmentList = data ? Object.entries(data).map(([id, equip]) => ({
        id,
        ...(equip as Omit<Equipment, "id">),
      })) : [];
      setEquipment(equipmentList);
    });

    const volunteersRef = ref(db, "volunteers");
    onValue(volunteersRef, (snapshot) => {
      const data = snapshot.val();
      const volunteersList = data ? Object.entries(data).map(([id, volunteer]) => ({
        id,
        ...(volunteer as Omit<Volunteer, "id">),
      })) : [];
      setVolunteers(volunteersList);
    });
  });

  const onSubmit = async (data: z.infer<typeof equipmentSchema>) => {
    try {
      const equipmentItem = equipment.find(
        (e) => e.type === data.type && e.number === data.number
      );

      if (equipmentItem) {
        await update(ref(db, `equipment/${equipmentItem.id}`), {
          volunteerId: data.volunteerId,
          isCheckedOut: true,
        });
        toast({
          title: "Success",
          description: "Equipment assigned successfully",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Equipment not found",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign equipment",
      });
    }
  };

  const handleReturn = async (equipmentId: string) => {
    try {
      await update(ref(db, `equipment/${equipmentId}`), {
        volunteerId: null,
        isCheckedOut: false,
      });
      toast({
        title: "Success",
        description: "Equipment returned successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to return equipment",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Equipment Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Package className="h-4 w-4 mr-2" />
              Assign Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Equipment</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="volunteerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volunteer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select volunteer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {volunteers.map((volunteer) => (
                            <SelectItem key={volunteer.id} value={volunteer.id}>
                              {volunteer.firstName} {volunteer.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EQUIPMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 100 }).map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Assign Equipment
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => {
            const volunteer = volunteers.find((v) => v.id === item.volunteerId);
            return (
              <TableRow key={item.id}>
                <TableCell className="capitalize">
                  {item.type.replace("_", " ")}
                </TableCell>
                <TableCell>{item.number}</TableCell>
                <TableCell>
                  {item.isCheckedOut ? "Checked Out" : "Available"}
                </TableCell>
                <TableCell>
                  {volunteer
                    ? `${volunteer.firstName} ${volunteer.lastName}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.isCheckedOut && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturn(item.id)}
                    >
                      Return
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
