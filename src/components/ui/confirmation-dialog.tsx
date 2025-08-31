import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Save, RefreshCw } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning";
  isLoading?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "default",
  isLoading = false
}: ConfirmationDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          icon: <Trash2 className="h-4 w-4" />,
          buttonVariant: "destructive" as const
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          buttonVariant: "outline" as const
        };
      default:
        return {
          icon: <Save className="h-4 w-4" />,
          buttonVariant: "default" as const
        };
    }
  };

  const { icon, buttonVariant } = getVariantStyles();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          
          <AlertDialogAction asChild>
            <Button 
              variant={buttonVariant} 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  {icon}
                  {confirmText}
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Predefined confirmation dialogs for common actions
export const useConfirmationDialog = () => {
  const confirmDelete = (
    onConfirm: () => void,
    itemName: string = "cet élément"
  ) => ({
    title: "Confirmer la suppression",
    description: `Êtes-vous sûr de vouloir supprimer ${itemName} ? Cette action ne peut pas être annulée.`,
    confirmText: "Supprimer",
    variant: "destructive" as const,
    onConfirm
  });

  const confirmSave = (
    onConfirm: () => void,
    hasUnsavedChanges: boolean = true
  ) => ({
    title: "Sauvegarder les modifications",
    description: hasUnsavedChanges 
      ? "Vous avez des modifications non sauvegardées. Voulez-vous les sauvegarder ?"
      : "Voulez-vous sauvegarder les modifications ?",
    confirmText: "Sauvegarder",
    variant: "default" as const,
    onConfirm
  });

  const confirmDiscard = (
    onConfirm: () => void
  ) => ({
    title: "Abandonner les modifications",
    description: "Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir les abandonner ?",
    confirmText: "Abandonner",
    variant: "warning" as const,
    onConfirm
  });

  const confirmReset = (
    onConfirm: () => void,
    itemName: string = "les données"
  ) => ({
    title: "Réinitialiser",
    description: `Êtes-vous sûr de vouloir réinitialiser ${itemName} ? Toutes les modifications seront perdues.`,
    confirmText: "Réinitialiser", 
    variant: "warning" as const,
    onConfirm
  });

  const confirmLogout = (
    onConfirm: () => void
  ) => ({
    title: "Se déconnecter",
    description: "Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.",
    confirmText: "Se déconnecter",
    variant: "default" as const,
    onConfirm
  });

  return {
    confirmDelete,
    confirmSave,
    confirmDiscard,
    confirmReset,
    confirmLogout
  };
};