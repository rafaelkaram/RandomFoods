import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUnidade1615734933552 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'unidade',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'taxa_conversao',
                    type: 'decimal',
                    precision: 8,
                    scale: 3
                },
                {
                    name: 'ingrediente_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'medida_id',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'unidadeIngrediente',
                    columnNames: [ 'ingrediente_id' ],
                    referencedTableName: 'ingrediente',
                    referencedColumnNames: [ 'id' ]
                },
                {
                    name: 'unidadeMedida',
                    columnNames: [ 'medida_id' ],
                    referencedTableName: 'medida',
                    referencedColumnNames: [ 'id' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('unidade');
    }

}