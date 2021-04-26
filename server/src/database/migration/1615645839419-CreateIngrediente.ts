import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateIngrediente1615645839419 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'ingrediente',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'nome',
                    type: 'varchar'
                },
                {
                    name: 'tipo_ingrediente',
                    type: 'enum',
                    enum: [
                        'BEBIDA',
                        'CARNE',
                        'CONDIMENTO',
                        'CONFEITARIA',
                        'GRAO',
                        'FRUTA',
                        'FRUTO_DO_MAR',
                        'LATICINIO',
                        'LEGUME',
                        'MASSA',
                        'MOLHO',
                        'NOZ',
                        'OLEO',
                        'OUTROS',
                        'PEIXE',
                        'TEMPERO',
                        'VEGETAL'
                    ]
                },
                {
                    name: 'tipo_unidade',
                    enumName: 'tipo_unidade_enum',
                    type: 'enum',
                    enum: [
                        'VOLUME',
                        'PESO',
                        'UNIDADE'
                    ]
                },
                {
                    name: 'sem_medida',
                    type: 'boolean',
                    default: false
                },
                {
                    name: 'derivado_leite',
                    type: 'boolean',
                    default: false
                },
                {
                    name: 'gluten',
                    type: 'boolean',
                    default: false
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('ingrediente');
    }

}