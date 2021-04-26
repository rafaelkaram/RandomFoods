import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMarca1619148927121 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'marca',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'usuario_id',
                    type: 'integer',
                },
                {
                    name: 'comentario_id',
                    type: 'integer',
                },
            ],
            foreignKeys: [
                {
                    name: 'marcaUsuario',
                    columnNames: [ 'usuario_id' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'marcaComentario',
                    columnNames: [ 'comentario_id' ],
                    referencedTableName: 'comentario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
            ],
            uniques: [
                {
                    name: 'usuarioComentario',
                    columnNames: [ 'usuario_id', 'comentario_id' ]
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('marca');
    }

}