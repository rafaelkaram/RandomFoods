import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAvaliacao1615645935563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'avaliacao',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'nota',
                    type:  'integer'
                },
                {
                    name: 'data',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'usuario_id',
                    type: 'integer'
                },
                {
                    name: 'receita_id',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'avaliacaoUsuario',
                    columnNames: [ 'usuario_id' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'avaliacaoReceita',
                    columnNames: [ 'receita_id' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ],
            uniques: [
                {
                    name: 'avaUsuarioReceita',
                    columnNames: [ 'usuario_id', 'receita_id' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('avaliacao');
    }

}