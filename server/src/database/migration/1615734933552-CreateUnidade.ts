import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUnidade1615734933552 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'unidade',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'nome',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'sigla',
                    type: 'varchar',
                },
                {
                    name: 'tipo',
                    type: 'enum',
                    enum: [
                        'VOLUME',
                        'PESO',
                        'UNIDADE'
                    ]
                },
                {
                    name: 'taxa_conversao',
                    type: 'decimal',
                    precision: 8,
                    scale: 3
                },
                {
                    name: 'id_ingrediente',
                    type: 'integer',
                    isNullable: true
                }
            ],
            foreignKeys: [
                {
                    name: 'unidadeIngrediente',
                    columnNames: [ 'id_ingrediente' ],
                    referencedTableName: 'ingrediente',
                    referencedColumnNames: [ 'id' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('unidade');
    }

}
