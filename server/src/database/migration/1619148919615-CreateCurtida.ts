import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFavorito1619148919615 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'curtida',
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
                    name: 'receita_id',
                    type: 'integer',
                },
            ],
            foreignKeys: [
                {
                    name: 'curtidaUsuario',
                    columnNames: [ 'usuario_id' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'curtidaReceita',
                    columnNames: [ 'receita_id' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
            ],
            uniques: [
                {
                    name: 'curUsuarioReceita',
                    columnNames: [ 'usuario_id', 'receita_id' ]
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('curtida');
    }

}