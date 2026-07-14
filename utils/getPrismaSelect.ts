import { FieldNode, GraphQLResolveInfo, SelectionNode } from "graphql";

type Mapping = Record<string, any>;

function buildSelect(selections: readonly SelectionNode[], mappings: Mapping = {}): Record<string, any> {
    const select: Record<string, any> = {};

    for (const selection of selections) {
        if (selection.kind !== "Field") continue;

        const fieldName = selection.name.value;

        // Custom mapping (GraphQL -> Prisma)
        if (mappings[fieldName]) {
            select[mappings[fieldName].key] = mappings[fieldName].value;
            continue;
        }

        // Nested relation
        if (selection.selectionSet) {
            select[fieldName] = {
                select: buildSelect(selection.selectionSet.selections),
            };
            continue;
        }

        // Scalar field
        select[fieldName] = true;
    }

    return select;
}

export function getPrismaSelect(
    info: GraphQLResolveInfo,
    rootField?: string,
    mappings: Mapping = {}
) {
    let selections = info.fieldNodes[0].selectionSet?.selections ?? [];

    // For nested objects (e.g. login.user)
    if (rootField) {
        const field = selections.find(
            (selection): selection is FieldNode =>
                selection.kind === "Field" &&
                selection.name.value === rootField
        );

        if (!field?.selectionSet) {
            return {};
        }

        selections = field.selectionSet.selections;
    }

    return buildSelect(selections, mappings);
}