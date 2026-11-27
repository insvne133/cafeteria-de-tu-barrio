import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Café Esquina — Tu cafetería de barrio" },
      { name: "description", content: "Café de especialidad, bollería casera y un rincón tranquilo en tu barrio." },
      { property: "og:title", content: "Café Esquina — Tu cafetería de barrio" },
      { property: "og:description", content: "Café de especialidad, bollería casera y un rincón tranquilo en tu barrio." },
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

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisa los campos");
      setStatus("error");
      return;
    }
    setStatus("sending");
    const { error: dbError } = await supabase.from("contact_submissions").insert(parsed.data);
    if (dbError) {
      setError("No se pudo enviar. Inténtalo de nuevo.");
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("ok");
  }

  const field = "w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring";
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">Nombre</label>
        <input id="name" name="name" maxLength={100} className={field} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" maxLength={255} className={field} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">Mensaje</label>
        <textarea id="message" name="message" rows={4} maxLength={1000} className={field} />
      </div>
      <button type="submit" disabled={status === "sending"} className="w-full rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
      {status === "ok" && <p role="status" className="text-sm text-primary">¡Gracias! Hemos recibido tu mensaje.</p>}
      {status === "error" && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </form>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl">Café Esquina</span>
        <a href="#contacto" className="text-sm underline underline-offset-4">Contacto</a>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-10 md:pt-20">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-muted-foreground">Desde 2014 · Calle del Olmo, 12</p>
        <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
          El café de la <em className="text-primary">esquina</em>,<br />hecho con calma.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Café de especialidad tostado cerca de casa, bollería que horneamos cada mañana y mesas donde quedarse un rato más.
        </p>
        <a href="#carta" className="mt-8 inline-block rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">Ver la carta</a>
      </section>

      <section id="carta" className="bg-secondary py-20">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl">La carta</h2>
            <p className="mt-4 text-muted-foreground">Pocas cosas, bien hechas. Leche vegetal sin coste extra.</p>
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
            <p className="mt-4 text-muted-foreground">¿Un encargo de tartas, un evento o una sugerencia? Te respondemos pronto.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground">© 2026 Café Esquina</footer>
    </div>
  );
}
