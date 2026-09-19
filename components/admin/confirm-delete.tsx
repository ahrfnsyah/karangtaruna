"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";

import { SubmitButton } from "./submit-button";

export type DeleteState = {
  error: string | null;
};

type DeleteAction = (prevState: DeleteState, formData: FormData) => Promise<DeleteState>;

type ConfirmDeleteProps = {
  action: DeleteAction;
  id: string;
  title: string;
};

/*
 * Hapus dengan konfirmasi inline: tombol "Hapus" membuka panel konfirmasi,
 * lalu "Ya, Hapus" mengirim Server Action penghapusan (dilewatkan via prop
 * `action`). Pesan error ditampilkan inline bila penghapusan gagal.
 */
export function ConfirmDelete({ action, id, title }: ConfirmDeleteProps) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState<DeleteState, FormData>(action, {
    error: null,
  });

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-accent-700 hover:text-accent-800"
        onClick={() => setConfirming(true)}
      >
        <TrashIcon className="h-4 w-4" />
        Hapus
      </Button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Konfirmasi hapus: ${title}`}
      className="rounded-control border border-accent-200 bg-accent-50 p-3 sm:p-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setConfirming(false);
        }
      }}
    >
      <p className="text-sm font-semibold text-foreground">Hapus &ldquo;{title}&rdquo;?</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Tindakan ini tidak dapat dibatalkan.
      </p>

      {state.error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-accent-700">
          {state.error}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <SubmitButton variant="accent" size="sm" pendingLabel="Menghapus..." autoFocus>
            Ya, Hapus
          </SubmitButton>
        </form>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={pending}
        >
          Batal
        </Button>
      </div>
    </div>
  );
}