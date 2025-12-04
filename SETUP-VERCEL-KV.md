# Vercel KV Setup für Visitor Counter (Marketplace)

**Vercel hat KV und Postgres in den Marketplace verschoben!** Das bedeutet:

- ✅ Einfachere Installation über den Marketplace
- ✅ Bessere Integration
- ✅ Gleiche Funktionalität

## Schritt 1: Vercel KV über Marketplace hinzufügen

1. Gehe zu deinem Vercel Dashboard: https://vercel.com/dashboard
2. Wähle dein Projekt aus
3. Klicke auf **"Marketplace"** im Seitenmenü
4. Suche nach **"Vercel KV"** oder **"Redis"**
5. Klicke auf **"Add"** oder **"Install"**
6. Wähle dein Projekt aus
7. Klicke auf **"Connect"** oder **"Create New Database"**
8. Wähle einen Namen (z.B. "visitor-counter")
9. Wähle eine Region (idealerweise gleiche wie dein Deployment)
10. Klicke auf **"Create & Connect"**

## Schritt 2: Environment Variables (automatisch!)

Der Marketplace fügt automatisch die benötigten Environment Variables hinzu:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

Du musst **nichts manuell konfigurieren**! 🎉

## Schritt 3: Deployment

1. Die Integration ist jetzt aktiv
2. Deploye dein Projekt neu (oder push einen Commit)
3. Der Visitor Counter funktioniert jetzt persistent!

## Alternative: Direkt im Projekt

Du kannst auch direkt im Projekt-Dashboard:
1. Gehe zu deinem Projekt
2. Suche nach **"Integrations"** oder **"Add-ons"**
3. Finde **"Vercel KV"**
4. Klicke auf **"Add"** und folge den Schritten

## Vorteile des Marketplace-Ansatzes

- ✅ **Zentrale Verwaltung**: Alle Integrationen an einem Ort
- ✅ **Einfachere Installation**: Weniger Klicks
- ✅ **Bessere Übersicht**: Siehst alle verbundenen Services
- ✅ **Automatic Environment Variables**: Keine manuelle Konfiguration

## Free Tier

- 256 MB Storage
- 10,000 Commands pro Tag (erhöht von 3,000!)
- Perfekt für einen Visitor Counter!

## Testen

Nach dem Setup:
1. Besuche deine Seite → Wirst als Besucher #1 gezählt
2. Reload → Wirst nicht nochmal gezählt ✅
3. Anderer Browser → Neuer Besucher! ✅
4. Deploy neu → Counter bleibt erhalten! ✅

## Troubleshooting

Falls der Counter nicht funktioniert:
1. Prüfe im Vercel Dashboard → Integrations → Vercel KV ist verbunden
2. Prüfe Settings → Environment Variables → KV Variables sind gesetzt
3. Deploy neu nach dem Hinzufügen von KV
