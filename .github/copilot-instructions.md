
# Copilot Instructions for Boilerplate

## Project Overview
- **Framework:** Next.js (App Router, TypeScript)
- **Architecture:** Modular, feature-driven (see `features/`), with shared UI and logic in `shared/`.
- **Database:** Drizzle ORM (see `drizzle/`, `db/`, and migration scripts)
- **Integrations:** Stripe, Uploadthing, custom Auth (see `app/api/`, `shared/lib/config/`)

## Key Patterns & Conventions

### Feature Module Pattern

Each business domain (e.g., `products`, `auth`, `cart`, `orders`, `category`) is a subfolder in `features/`. Every feature is self-contained and follows this structure:

```
features/<feature>/
  components/
    atoms/        # Smallest UI elements (e.g., Button, Input)
    molecules/    # Composed UI (e.g., ProductList, CartMenu)
    organisms/    # Complex UI (e.g., ProductTable, AuthForm)
  hooks/          # React hooks for stateful or reusable logic
  config/         # Zod schemas, types, constants, params
  domain/
    service.ts    # Service layer for business logic
    use-cases/    # One file per use-case (e.g., create-*.use-case.ts)
```


### Relation Management Standard (Admin UI)

For all entity relationships (e.g., product-category, product-tags, user-roles, etc.), follow these standards for admin UI and logic:

- **Centralized Relation Management:**
  - On the detail page of each entity (e.g., category, tag, supplier), display a list/table of related entities (e.g., products in a category).
  - Provide actions to add, remove, or edit related entities directly from this view.

- **Bidirectional Editing:**
  - On the detail page of the main entity (e.g., product), show all its relations (categories, tags, suppliers, etc.) as editable lists (chips/tags, tables, or sections).
  - Allow adding/removing relations via autocomplete, multi-select, or modal dialogs for better UX (avoid basic dropdowns for large datasets).

- **Bulk & Inline Actions:**
  - Support bulk assignment/removal of relations where relevant (multi-select, checkboxes, etc.).
  - Provide inline actions (edit, unlink, view) for each related item.

- **Scalability:**
  - Use pagination, search, or lazy loading for large relation lists.

- **Consistency:**
  - Always keep relation management logic close to the feature (in `domain/use-cases/` and `hooks/`).
  - UI for relation management should be in `components/organisms/` or `molecules/` as appropriate.

- **Example:**
  - On a category detail page: show a paginated table of products in the category, with actions to add/remove products.
  - On a product detail page: show all categories/tags as removable chips, with an autocomplete to add new ones.


- Make relation management intuitive, scalable, and maintainable for all admin features.

---

## Admin UI Best Practices

- **User Feedback:**
  - Always display clear notifications for user actions (success, error, confirmation) using a consistent toast/snackbar system (see `shared/hooks/use-toast.ts` or similar).

- **Modularity:**
  - Structure admin code so new modules/features can be added easily. Follow the feature module pattern (`features/<feature>/...`) and keep business logic, UI, and types well separated and reusable.

---

**Example: Product-Category Relation Management (Admin UI)**

- On the category detail page (`features/category/components/organisms/category-detail.tsx`):
  - Show a paginated table of products in the category.
  - Each product row has actions: view, edit, remove from category.
  - Button to add products: opens an autocomplete or multi-select modal to pick products to add to this category.

- On the product detail page (`features/products/components/organisms/product-detail.tsx`):
  - Show all categories as removable chips/tags.
  - Autocomplete input to add this product to more categories.
  - Same pattern for tags, suppliers, etc.

**Example file structure:**

```
features/category/components/organisms/category-detail.tsx
features/category/domain/use-cases/add-product-to-category.use-case.ts
features/category/domain/use-cases/remove-product-from-category.use-case.ts
features/products/components/organisms/product-detail.tsx
features/products/domain/use-cases/add-category-to-product.use-case.ts
features/products/domain/use-cases/remove-category-from-product.use-case.ts
```

**UI Example (pseudo-code):**

```tsx
// In category-detail.tsx
<ProductTable products={category.products} onRemove={removeProduct} />
<Button onClick={openAddProductModal}>Add Product</Button>
<AddProductModal onAdd={addProductsToCategory} />

// In product-detail.tsx
<CategoryChips categories={product.categories} onRemove={removeCategory} />
<Autocomplete onSelect={addCategoryToProduct} />
```

This pattern should be applied to all entity relations (tags, suppliers, etc.) for a consistent admin experience.

- **Simplicity:**
  - Always favor simple, clear, and maintainable solutions in admin UI and logic. Avoid over-engineering; prioritize usability and straightforward code.

- **Statistics & Overview:**
  - Always consider which relevant statistics (counts, trends, KPIs) can be shown and surface them on the admin overview dashboard for better visibility and decision-making.
- **Modularity:**
  - Structure admin code so new modules/features can be added easily. Follow the feature module pattern (`features/<feature>/...`) and keep business logic, UI, and types well separated and reusable.

- **Simplicity:**
  - Always favor simple, clear, and maintainable solutions in admin UI and logic. Avoid over-engineering; prioritize usability and straightforward code.

**Example:**
- `features/products/components/organisms/crud/add.tsx` (UI for adding a product)
- `features/products/domain/use-cases/create-product.use-case.ts` (business logic for product creation)
- `features/products/config/product.schema.ts` (Zod schema for product validation)
- `features/products/hooks/use-products.ts` (fetching product list)

**Why this pattern?**
- Keeps each feature isolated, testable, and easy to maintain
- UI is built from small to large (atomic design)
- Business logic is separated from UI and colocated with its feature
- Types and validation are always close to where they're used

**Shared code** (e.g., generic UI, hooks) lives in `shared/` and should be reused across features.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (or `bun dev`, `yarn dev`, `pnpm dev`)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **DB Migrations:**
  - Generate: `npm run db:generate`
  - Migrate: `npm run db:migrate`
  - Studio: `npm run db:studio`
- **Stripe Webhook Dev:** `npm run stripe:listen`

## Creating a New Feature

### How to Create a New Feature

1. **Create a folder in `features/`** (e.g., `features/inventory/`).
2. **Add these subfolders:**
  - `components/atoms/`, `components/molecules/`, `components/organisms/` (for UI)
  - `hooks/` (for custom React hooks)
  - `config/` (for Zod schemas, types, params)
  - `domain/service.ts` and `domain/use-cases/` (for business logic)
3. **UI:** Build UI from atoms → molecules → organisms. Example: `ProductItem` (atom) → `ProductList` (molecule) → `ProductTable` (organism).
4. **Business logic:** Put each use-case in its own file in `domain/use-cases/` (e.g., `create-inventory.use-case.ts`).
5. **Types & validation:** Define types and Zod schemas in `config/` (e.g., `inventory.schema.ts`).
6. **API:** If needed, add an endpoint in `app/api/v1/<feature>/route.ts`.
7. **Reuse:** Use shared UI and logic from `shared/` whenever possible.

**See `features/products/` for a complete example.**

## Integration Points
- **Drizzle ORM:** See `drizzle/`, `db/`, and migration scripts for schema and data access.
- **Stripe:** Payment and webhook logic in `app/api/stripe/` and `shared/lib/config/stripe.ts`.
- **Uploadthing:** File upload logic in `app/api/uploadthing/` and `shared/lib/utils/uploadthing.ts`.
- **Auth:** Custom logic in `features/auth/` and `app/api/auth/`.

## Project-Specific Notes
- **Use absolute imports** (e.g., `@/features/products/...`).
- **Colocate types, schemas, and business logic** within each feature.
- **Prefer hooks for stateful logic** and context for cross-feature state.
- **Follow atomic design for UI** (atoms → molecules → organisms).

---

For more, see `README.md` and explore the `features/` and `shared/` directories for examples.
