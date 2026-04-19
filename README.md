# Rav Messer MCP - רב מסר

שרת MCP שמחבר את Claude Code למערכת הדיוור רב מסר (Responder).

## מה אפשר לעשות

- ניהול רשימות תפוצה
- הוספה, עדכון ומחיקת מנויים
- שליחת הודעות
- ניהול תצוגות (views)
- ניהול שדות אישיים

## התקנה

```bash
curl -sL https://github.com/yahav123147/ravmesser-mcp/archive/main.tar.gz | tar -xz
mv ravmesser-mcp-main ravmesser-mcp
cd ravmesser-mcp
npm install
```

## הגדרת מפתחות API

צריך 4 מפתחות מממשק הניהול של רב מסר (הגדרות → API):

```bash
export RESPONDER_C_KEY="your_c_key"
export RESPONDER_C_SECRET="your_c_secret"
export RESPONDER_U_KEY="your_u_key"
export RESPONDER_U_SECRET="your_u_secret"
```

## הגדרת MCP ב-Claude Code

הוסיפו לקובץ `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "ravmesser": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "cwd": "/path/to/ravmesser-mcp",
      "env": {
        "RESPONDER_C_KEY": "your_c_key",
        "RESPONDER_C_SECRET": "your_c_secret",
        "RESPONDER_U_KEY": "your_u_key",
        "RESPONDER_U_SECRET": "your_u_secret"
      }
    }
  }
}
```

## 22 כלים זמינים

| כלי | תיאור |
|-----|--------|
| get_lists | הצגת רשימות תפוצה |
| get_subscribers | הצגת מנויים ברשימה |
| create_subscribers | הוספת מנויים |
| update_subscribers | עדכון מנויים |
| delete_subscribers | מחיקת מנויים |
| get_messages | הצגת הודעות |
| create_message | יצירת הודעה |
| update_message | עדכון הודעה |
| delete_message | מחיקת הודעה |
| get_views | הצגת תצוגות |
| get_personal_fields | הצגת שדות אישיים |
| ועוד... | |
