"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';

const CONFIG = {
  // HIER später die Google Script URL in Vercel eintragen!
  scriptUrl: process.env.NEXT_PUBLIC_SCRIPT_URL || ''
};

const categories = [
  { title: "Ausgangspunkt", color: "bg-blue-50", border: "border-blue-200", qs: ["Wie klar war dir die Aufgabe zu Beginn und hat sie sich im Zuge des Vibe Codings verändert?", "Wie konnte die KI mit weniger präzisen Anweisungen umgehen?", "Gab es am Ende einen Unterschied zwischen dem, was du „im Kopf“ hattest, und dem, was die KI daraus gemacht hat? Wie war dies sichtbar?"] },
  { title: "Dialog mit einer KI", color: "bg-purple-50", border: "border-purple-200", qs: ["Welche Prompts oder Gesprächsstrategien haben besonders gut funktioniert? Welche haben eher zu Missverständnissen geführt?", "Hat sich deine Rolle im Verlauf des vibe codings verändert? wenn ja wie?", "Gab es Momente, in denen du die KI bewusst korrigieren oder neu ausrichten musstest?"] },
  { title: "Überblick behalten", color: "bg-green-50", border: "border-green-200", qs: ["Wie hast du den Überblick behalten? (was funktioniert, was ist noch offen ...)", "Gab es einen Moment, in dem eine neue Änderung das Ergebnis verschlechtert hat? Wie bist du damit umgegangen?", "Wie gut konntest du nachvollziehen, welche Änderungen die KI am Code vorgenommen hat?"] },
  { title: "Technisches Verstehen", color: "bg-amber-50", border: "border-amber-200", qs: ["Hast du verstanden, wie Daten in deiner App gespeichert, gelesen oder verändert werden? Falls nicht: Welche Fragen bleiben offen?", "Gab es Codeabschnitte, die dir besonders wichtig erschienen, etwa für Datenverarbeitung, Nutzeroberfläche, Logik, Speicherung oder Fehlerbehandlung?", "Wo liegt für dich die Grenze zwischen „Ich verstehe genug“ und „Ich vertraue darauf, dass es irgendwie funktioniert“?"] },
  { title: "Fehler und Fehlersuche", color: "bg-rose-50", border: "border-rose-200", qs: ["Welche Fehler oder Probleme traten während der Entwicklung auf? (Beispiele)", "Welche Rolle spielten Fehlermeldungen? Konntest du sie selbst deuten oder hast du sie vor allem an die KI zurückgegeben?", "Was hast du über Debugging gelernt, also über das systematische Eingrenzen von Problemen?"] },
  { title: "Arbeitsteilung", color: "bg-indigo-50", border: "border-indigo-200", qs: ["Hat die KI dir eher geholfen, selbst handlungsfähiger zu werden, oder entstand eher das Gefühl, abhängig zu sein?", "Wie würdest du deine eigene Leistung beschreiben, wenn ein großer Teil des Codes von der KI erzeugt wurde?", "Was bedeutet in diesem Projekt „Autor:innenschaft“: Wer hat die App gemacht, wer hat sie gestaltet, wer trägt Verantwortung?"] },
  { title: "Selbstwirksamkeit", color: "bg-teal-50", border: "border-teal-200", qs: ["Hat Vibe Coding dein Gefühl verändert, digitale Anwendungen selbst gestalten zu können? Oder war es eher ein „Ich verstehe gar nicht mehr, was hier passiert“?", "Hat die KI eher Neugier erzeugt oder technische Distanz verstärkt?", "Was konntest du am Ende besser einschätzen als zu Beginn deines vibe coding Projektes?"] },
  { title: "Fazit und Transfer", color: "bg-orange-50", border: "border-orange-200", qs: ["Was würdest du beim nächsten Vibe-Coding-Projekt anders machen?", "Welche Kompetenz erscheint dir im Rückblick wichtiger: Programmierwissen, Prompting, Projektmanagement, kritische Prüfung oder fachliche Urteilskraft?", "Welche Frage möchtest du in die Gruppendiskussion einbringen?"] }
];

export default function Survey() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const updateAnswer = (catIdx, qIdx, val) => {
    setAnswers(prev => ({ ...prev, [`cat${catIdx + 1}_q${qIdx + 1}`]: val }));
  };

  const submit = async () => {
    setStatus('loading');
    try {
      await fetch(CONFIG.scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      setStatus('success');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-emerald-100">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Vielen Dank!</h1>
          <p className="text-slate-600">Deine Reflexionen wurden erfolgreich gespeichert.</p>
        </div>
      </div>
    );
  }

  const currentCat = categories[step];
  const progress = ((step + 1) / categories.length) * 100;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${currentCat.color} p-4 md:p-8 font-sans`}>
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-2">Reflexionsfragen</h1>
          <h2 className="text-3xl font-extrabold text-slate-800">Vibe Coding</h2>
          <div className="w-full bg-white/50 h-2 rounded-full mt-6 overflow-hidden border border-white/20">
            <div className="bg-slate-800 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2">Kategorie {step + 1} von {categories.length}</p>
        </header>

        <main className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-sm border ${currentCat.border} transition-all`}>
          <h3 className="text-xl font-bold text-slate-700 mb-6">{currentCat.title}</h3>
          
          <div className="space-y-8">
            {currentCat.qs.map((q, i) => (
              <div key={i} className="space-y-3">
                <label className="block text-slate-600 font-medium leading-relaxed">{q}</label>
                <textarea
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all min-h-[120px] text-slate-700 shadow-sm"
                  placeholder="Deine Antwort..."
                  value={answers[`cat${step + 1}_q${i + 1}`] || ''}
                  onChange={(e) => updateAnswer(step, i, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-10">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all ${step === 0 ? 'opacity-0' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Zurück
            </button>

            {step < categories.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center bg-slate-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-slate-700 shadow-lg transition-all"
              >
                Weiter <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={status === 'loading'}
                className="flex items-center bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-500 shadow-lg transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Wird gesendet...' : 'Absenden'} <Send className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
