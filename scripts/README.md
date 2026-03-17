# Scripts

Utility scripts for managing the AI Research Guide application.

## Available Scripts

### `migrate-knowledge.ts`
Migrates knowledge base files from the old CLI structure to the new Next.js structure.

```bash
npx ts-node scripts/migrate-knowledge.ts
```

### `seed-knowledge.ts`
Seeds the knowledge base with data from the QuestionPro workspace.

```bash
npx ts-node scripts/seed-knowledge.ts
```

## Future Scripts

Consider adding:
- **validate-knowledge.ts**: Validate JSON schema and data integrity
- **generate-examples.ts**: Generate example queries from knowledge base
- **benchmark.ts**: Test response quality and consistency
- **export-knowledge.ts**: Export knowledge base for backup or sharing
