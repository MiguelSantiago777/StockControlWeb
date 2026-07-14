"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { vehicleSchema, type VehicleFormValues } from "../schemas/vehicle-schema";
import { useCreateVehicle, useUpdateVehicle } from "../hooks/use-vehicles";
import type { Vehicle } from "@/types/entities";

interface VehicleFormModalProps {
  open: boolean;
  vehicle?: Vehicle;
  onOpenChange: (open: boolean) => void;
}

const TYPE_LABEL: Record<VehicleFormValues["type"], string> = {
  Moto: "Moto",
  Carro: "Carro",
  CaminhaoVan: "Caminhão / Van",
};

export function VehicleFormModal({ open, vehicle, onOpenChange }: VehicleFormModalProps) {
  const isEdit = !!vehicle;
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({ resolver: zodResolver(vehicleSchema) });

  useEffect(() => {
    if (!open) return;
    reset(
      vehicle
        ? { plate: vehicle.plate, type: vehicle.type, model: vehicle.model ?? "" }
        : { plate: "", type: "Carro", model: "" },
    );
  }, [open, vehicle, reset]);

  const onSubmit = async (values: VehicleFormValues) => {
    const payload = { ...values, model: values.model || undefined };

    if (isEdit) {
      await updateVehicle.mutateAsync({ id: vehicle.id, payload });
    } else {
      await createVehicle.mutateAsync(payload);
    }

    onOpenChange(false);
  };

  const isPending = createVehicle.isPending || updateVehicle.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar veículo" : "Novo veículo"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Placa" htmlFor="plate" error={errors.plate?.message}>
            <Input id="plate" placeholder="ABC1234 ou ABC1D23" className="uppercase" {...register("plate")} />
          </FormField>

          <FormField label="Tipo" htmlFor="type" error={errors.type?.message}>
            <select
              id="type"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("type")}
            >
              {(Object.keys(TYPE_LABEL) as VehicleFormValues["type"][]).map((type) => (
                <option key={type} value={type}>{TYPE_LABEL[type]}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Modelo" htmlFor="model" error={errors.model?.message}>
            <Input id="model" placeholder="Ex.: Honda CG 160" {...register("model")} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? "Salvar alterações" : "Criar veículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
