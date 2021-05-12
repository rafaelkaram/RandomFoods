import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMidia1615734949952 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'midia',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'path',
                    type: 'varchar'
                },
                {
                    name: 'tipo',
                    type: 'enum',
                    enum: [ 'FOTO', 'VIDEO' ]
                },
                {
                    name: 'data_cadastro',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'ativa',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'receita_id',
                    type: 'integer'
                },
                {
                    name: 'thumbnail',
                    type: 'boolean',
                    default: false
                }
            ],
            foreignKeys: [
                {
                    name: 'midiaReceita',
                    columnNames: [ 'receita_id' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('midia');
    }

}