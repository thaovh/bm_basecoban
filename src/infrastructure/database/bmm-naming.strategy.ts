import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class BMMNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(className: string, customName?: string): string {
        if (customName) {
            return customName;
        }
        // Convert ClassName to BMM_TABLE_NAME format
        const snakeCase = className.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `BMM_${snakeCase.substring(1).toUpperCase()}`;
    }

    columnName(propertyName: string, customName?: string, embeddedPrefixes: string[] = []): string {
        if (customName) {
            return customName;
        }
        // Convert propertyName to COLUMN_NAME format
        const snakeCase = propertyName.replace(/([A-Z])/g, '_$1').toLowerCase();
        return snakeCase.substring(1).toUpperCase();
    }

    indexName(tableOrName: string | { name: string }, columns: string[], where?: string): string {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
        const columnNames = columns.join('_');
        return `IDX_${tableName}_${columnNames}`;
    }

    primaryKeyName(tableOrName: string | { name: string }, columnNames: string[]): string {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
        return `PK_${tableName}`;
    }

    uniqueConstraintName(tableOrName: string | { name: string }, columnNames: string[]): string {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
        const columnNamesStr = columnNames.join('_');
        return `UK_${tableName}_${columnNamesStr}`;
    }

    foreignKeyName(tableOrName: string | { name: string }, columnNames: string[], referencedTablePath?: string, referencedColumnNames?: string[]): string {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
        const referencedTableName = referencedTablePath?.split('.').pop();
        return `FK_${tableName}_${referencedTableName}`;
    }
}
