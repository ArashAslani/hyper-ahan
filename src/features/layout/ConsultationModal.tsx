"use client";

import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import { Input, Textarea } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

type ConsultationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `درخواست مشاوره ثبت شد (mock)\nنام: ${formData.name}\nتلفن: ${formData.phone}\nتوضیحات: ${formData.description}`,
    );
    onClose();
    setFormData({ name: "", phone: "", description: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="درخواست مشاوره">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="نام و نام خانوادگی"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="شماره تماس"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Textarea
          label="توضیحات (نوع محصول، نیاز خاص)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
        <Button type="submit" fullWidth>
          ثبت درخواست
        </Button>
      </form>
    </Modal>
  );
}
