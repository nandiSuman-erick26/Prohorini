import {
  emergencyContactSchema,
  EmergencyContactInput,
} from "@/services/validations/schemas/zod.emergencyConntacts";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEmergencyContacts } from "@/hooks/react-query/useEmergencyContacts";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle, Trash2, Edit2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { selectEditingContactId } from "@/hooks/redux/store/user/userProfileSelector";
import { setEditingContactId } from "@/hooks/redux/redux-slices/userProfileSlice";
import { toast } from "sonner";

const EmergencyContacForm = () => {
  const { data: contacts, isLoading: contactsLoading } = useEmergencyContacts();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const editingContactId = useAppSelector(selectEditingContactId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmergencyContactInput>({
    resolver: zodResolver(emergencyContactSchema),
  });

  // Populate form when editingContactId changes
  useEffect(() => {
    if (editingContactId && contacts) {
      const contact = contacts.find((c: any) => c.id === editingContactId);
      if (contact) {
        setValue("name", contact.name);
        setValue("phone", contact.phone);
        setValue("email", contact.email || "");
        setValue("relationship", contact.relationship || "");
      }
    } else if (!editingContactId) {
      reset({
        name: "",
        phone: "",
        email: "",
        relationship: "",
      });
    }
  }, [editingContactId, contacts, setValue, reset]);

  const onSubmit = async (data: EmergencyContactInput) => {
    try {
      const method = editingContactId ? "PATCH" : "POST";
      const url = editingContactId
        ? `/api/emergency-contacts?id=${editingContactId}`
        : "/api/emergency-contacts";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingContactId ? "update" : "add"} contact`,
        );
      }

      await queryClient.invalidateQueries({ queryKey: ["circle-contacts"] });
      reset();
      dispatch(setEditingContactId(null));
      toast.success(
        `Contact ${editingContactId ? "updated" : "added"} successfully`,
      );
    } catch (error: any) {
      console.error("Error saving contact:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      // If we are currently editing this contact, cancel the edit first
      if (editingContactId === id) {
        cancelEdit();
      }

      const res = await fetch(`/api/emergency-contacts?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete contact");
      }

      await queryClient.invalidateQueries({ queryKey: ["circle-contacts"] });
      toast.success("Contact deleted");
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  const startEdit = (id: string) => {
    dispatch(setEditingContactId(id));
    window.scrollTo({
      top: document.getElementById("emergency-form")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    dispatch(setEditingContactId(null));
    reset();
  };

  return (
    <div className="space-y-8">
      <div id="emergency-form">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            {editingContactId ? "Edit Contact" : "Add New Contact"}
          </h3>
          {editingContactId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelEdit}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_name">Contact Name</Label>
            <Input
              id="contact_name"
              {...register("name")}
              placeholder="Name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-destructive text-sm font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Phone Number</Label>
            <Input
              id="contact_phone"
              {...register("phone")}
              placeholder="+1 234 567 890"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-destructive text-sm font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email (Optional)</Label>
            <Input
              id="contact_email"
              type="email"
              {...register("email")}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              {...register("relationship")}
              placeholder="e.g. Spouse, Parent, Friend"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : editingContactId ? (
            <Edit2 className="mr-2 h-4 w-4" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {editingContactId ? "Update Contact" : "Add Contact"}
        </Button>
      </form>

      {/* Contacts List */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
          Current Contacts
        </h3>

        {contactsLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : contacts && contacts.length > 0 ? (
          <div className="grid gap-3">
            {contacts.map((contact: any) => (
              <div
                key={contact.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${editingContactId === contact.id ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                    {contact.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {contact.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {contact.relationship} • {contact.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                    onClick={() => startEdit(contact.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium font-mono">
              NO CONTACTS ADDED YET
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacForm;
