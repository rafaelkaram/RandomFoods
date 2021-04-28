import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateComentario1615645929990 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'comentario',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'valor',
                    type: 'text',
                },
                {
                    name: 'data',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'pai_id',
                    type: 'integer',
                    isNullable: true
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
                    name: 'comentarioComentario',
                    columnNames: [ 'pai_id' ],
                    referencedTableName: 'comentario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'comentarioUsuario',
                    columnNames: [ 'usuario_id' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'comentarioReceita',
                    columnNames: [ 'receita_id' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('comentario');
    }

}