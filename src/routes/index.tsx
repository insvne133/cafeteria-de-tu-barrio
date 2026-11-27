import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Café Esquina — Tu cafetería de barrio" },
      {
        name: "description",
        content: "Café de especialidad, bollería casera y un rincón tranquilo en tu barrio.",
      },
      { property: "og:title", content: "Café Esquina — Tu cafetería de barrio" },
      {
        property: "og:description",
        content: "Café de especialidad, bollería casera y un rincón tranquilo en tu barrio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const schema = z.object({
  name: z.string().trim().min(1, "Escribe tu nombre").max(100),
  email: z.string().trim().email("Email no válido").max(255),
  message: z.string().trim().min(1, "Escribe un mensaje").max(1000),
});

const menu = [
  ["Espresso", "1,60 €"],
  ["Flat white", "2,80 €"],
  ["Cortado de avena", "2,20 €"],
  ["Croissant de mantequilla", "1,90 €"],
  ["Tostada con tomate", "3,20 €"],
  ["Tarta de queso", "4,00 €"],
];

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const fieldClass =
  "w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring";

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [sendError, setSendError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) {
      const found: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (!found[key]) found[key] = issue.message;
      }
      setErrors(found);
      setSendError("");
      setStatus("idle");
      const first = (["name", "email", "message"] as Field[]).find((f) => found[f]);
      if (first) form.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }
    setErrors({});
    setSendError("");
    setStatus("sending");
    try {
      const { error: dbError } = await supabase.from("contact_submissions").insert(parsed.data);
      if (dbError) throw dbError;
    } catch {
      setSendError("No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.");
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("ok");
  }

  function fieldProps(name: Field) {
    const error = errors[name];
    return {
      id: name,
      name,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${name}-error` : undefined,
      className: `${fieldClass} ${error ? "border-destructive" : "border-input"}`,
      onChange: () => error && setErrors((prev) => ({ ...prev, [name]: undefined })),
    };
  }

  function fieldError(name: Field) {
    if (!errors[name]) return null;
    return (
      <p id={`${name}-error`} className="mt-1 text-sm text-destructive">
        {errors[name]}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nombre
        </label>
        <input {...fieldProps("name")} maxLength={100} autoComplete="name" />
        {fieldError("name")}
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input {...fieldProps("email")} type="email" maxLength={255} autoComplete="email" />
        {fieldError("email")}
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Mensaje
        </label>
        <textarea {...fieldProps("message")} rows={4} maxLength={1000} />
        {fieldError("message")}
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
      <div role="status" aria-live="polite" className="text-sm">
        {status === "ok" && <p className="text-primary">¡Gracias! Hemos recibido tu mensaje.</p>}
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {sendError}
        </p>
      )}
    </form>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl">Café Esquina</span>
        <a
          href="#contacto"
          className="-mx-3 inline-flex min-h-11 items-center px-3 text-sm underline underline-offset-4"
        >
          Contacto
        </a>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-10 md:pt-20">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Desde 2014 · Calle del Olmo, 12
        </p>
        <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
          El café de la <em className="text-primary">esquina</em>,<br />
          hecho con calma.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Café de especialidad tostado cerca de casa, bollería que horneamos cada mañana y mesas
          donde quedarse un rato más.
        </p>
        <a
          href="#carta"
          className="mt-8 inline-block rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
        >
          Ver la carta
        </a>
      </section>

      <section id="carta" className="bg-secondary py-20">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl">La carta</h2>
            <p className="mt-4 text-muted-foreground">
              Pocas cosas, bien hechas. Leche vegetal sin coste extra.
            </p>
          </div>
          <ul className="divide-y divide-border">
            {menu.map(([item, price]) => (
              <li key={item} className="flex justify-between gap-4 py-3">
                <span>{item}</span>
                <span className="shrink-0 font-medium">{price}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-20 sm:grid-cols-3">
        {[
          ["Horario", "Lun–Vie 7:30–19:00\nSáb–Dom 9:00–14:00"],
          ["Dónde", "Calle del Olmo, 12\nEsquina con Pl. Mayor"],
          ["Wifi y enchufes", "Para trabajar un rato,\nsin prisa."],
        ].map(([t, d]) => (
          <div key={t}>
            <h3 className="font-display text-2xl">{t}</h3>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section id="contacto" className="bg-card py-20">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl">Escríbenos</h2>
            <p className="mt-4 text-muted-foreground">
              ¿Un encargo de tartas, un evento o una sugerencia? Te respondemos pronto.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        © 2026 Café Esquina
      </footer>
    </div>
  );
}
